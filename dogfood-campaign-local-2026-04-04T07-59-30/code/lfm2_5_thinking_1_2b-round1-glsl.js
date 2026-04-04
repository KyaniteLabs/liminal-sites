#version 330 소속

uniform float time;
uniform vec2 resolution;
uniform sampler2D u_texture;

// --- Noise Functions ---

// Simple pseudo-random hash function (for repeatable noise)
float hash(vec2 p)
{
    return fract(sin(dot(p, vec2(41.333, 2.222))) * 43758.5453);
}

// Value Noise (Perlin-like approximation)
float noise(vec2 p)
{
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoothstep interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Corner weights (randomly generated based on integer coordinates)
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Flow Field Noise (for swirling movement)
float flow_noise(vec2 p, float t)
{
    // Scale and shift coordinates over time for animation
    vec2 offset = vec2(t * 0.1, t * 0.05);
    vec2 p_anim = p * 0.8 + offset;

    // Combine multiple noise calls for complex, swirling patterns
    float n1 = noise(p_anim * vec2(1.0, 1.0));
    float n2 = noise((p_anim + vec2(10.0, 0.0)) * vec2(1.0, 0.5));
    float n3 = noise((p_anim + vec2(0.0, 10.0)) * vec2(0.5, 1.0));

    return (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);
}

// --- Main Shader Logic ---

void main()
{
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 4.0; // Scale coordinates

    // 1. Plasma Core Simulation (using flow_noise)
    float flow = flow_noise(p, time * 0.5);

    // Smooth the noise output to create a mask
    float plasma_intensity = pow(saturate(flow) * 1.5, 1.5);

    // Add a radial component to focus the core
    float radial_mask = 1.0 - length(uv - 0.5) * 2.0;
    plasma_intensity *= radial_mask;

    // 2. Animated Color Generation
    
    // Time-based shift for color hue
    float hue_shift = sin(time * 0.5) * 0.5 + 0.5;
    float color_shift = sin(time * 0.7) * 0.5 + 0.5;
    
    // Calculate color components based on position and time
    // A complex combination of sine waves ensures smooth, animated color gradients.
    float r = 0.5 + 0.3 * cos(p.x * 1.5 + time * 0.5 + hue_shift);
    float g = 0.5 + 0.3 * sin(p.y * 1.5 + time * 0.5 + color_shift);
    float b = 0.5 + 0.3 * cos((p.x + p.y) * 1.2 + time * 0.3);

    vec3 base_color = vec3(r, g, b);

    // 3. Combine Plasma Effect and Color
    
    // The plasma_intensity acts as an emission mask or multiplier.
    // The color is strongest where the noise is high.
    vec3 final_color = base_color * plasma_intensity;

    // Add subtle glow/bloom effect by blending with the original texture
    vec3 ambient_color = texture(u_texture, uv).rgb;
    final_color = mix(final_color, ambient_color * 0.1, 0.5);


    // Output color
    gl_FragColor = vec4(final_color, 1.0);
}