#version 330 소

// Uniforms
uniform float u_time;
uniform vec2 u_resolution;

// Input coordinates
in vec2 v2f_TexCoord;

out vec4 fragColor;

// --- Noise Functions ---

// Simple pseudo-random helper
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// Value Noise implementation (Simplified for performance)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth step interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Gather corner values
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Bilinear interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Octave Noise combination (Fractal Brownian Motion)
float fbm(vec2 p, int octaves, float lacunarity, float persistence) {
    float total = 0.0;
    float frequency = 0.0;
    float amplitude = 1.0;

    for (int i = 0; i < octaves; i++) {
        total += noise(p * frequency) * amplitude;
        frequency *= lacunarity;
        amplitude *= persistence;
    }
    return total;
}

// --- Main Shader Logic ---
void main() {
    // Normalize UV coordinates
    vec2 uv = v2f_TexCoord * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y; // Aspect correction

    float time = u_time * 0.3;

    // 1. Plasma Core Noise Generation
    // Use offset time and position to create dynamic, swirling patterns
    vec2 p1 = uv * 0.8 + vec2(time * 0.2, time * 0.15);
    float n1 = fbm(p1, 4, 2.0, 0.5);

    vec2 p2 = uv * 1.2 + vec2(time * 0.1, time * 0.3);
    float n2 = fbm(p2, 5, 2.2, 0.5);

    // Combine noise layers to create a complex, flowing pattern
    float plasma_intensity = sin(n1 * 1.5 + n2 * 0.8) * 0.5 + 0.5;
    
    // Add a rotational component using trigonometry
    float swirl = sin(uv.y * 5.0 + time * 0.5) * cos(uv.x * 5.0 + time * 0.5) * 0.5;
    
    float final_noise = plasma_intensity * 0.7 + swirl * 0.3;
    final_noise = pow(final_noise, 1.2); // Sharpen the effect

    // 2. Color Mapping and Animation
    
    // Color shift factors based on time and position
    float r_shift = sin(uv.x * 3.0 + time * 1.5) * 0.5 + 0.5;
    float g_shift = cos(uv.y * 2.5 + time * 1.0) * 0.5 + 0.5;
    float b_shift = sin((uv.x + uv.y) * 1.5 + time * 2.0) * 0.5 + 0.5;

    // Modulate the shifts by the plasma noise intensity
    vec3 color_base = vec3(
        r_shift * final_noise * 0.8,
        g_shift * final_noise * 0.7,
        b_shift * final_noise * 0.9
    );
    
    // Add a radial glow effect
    float dist_factor = 1.0 - pow(length(uv), 2.0) * 0.5;
    vec3 glow = vec3(0.5) * exp(-10.0 * pow(length(uv) * 0.8, 2.0));

    // Final color mix
    vec3 final_color = color_base * 1.5 + glow;

    // Output
    fragColor = vec4(final_color, 1.0);
}