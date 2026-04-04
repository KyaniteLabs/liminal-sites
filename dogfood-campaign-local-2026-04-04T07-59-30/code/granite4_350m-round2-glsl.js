#version 330 소

uniform vec2 u_resolution;
uniform float u_time;

// Simple hash function for pseudo-randomness
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.2, 35.9))) * 43758.5453);
}

// Smooth noise function (approximation)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Interpolation weights
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Multi-octave noise for fluid motion
float fbm(vec2 p, float scale) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; ++i) {
        value += noise(p * frequency * scale) * amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 6.0 + u_time * 0.1;

    // --- Base Turbulence/Structure ---
    float noise_y = fbm(p + vec2(0.0, 0.5), 1.5);
    float noise_x = fbm(p + vec2(0.5, 0.0), 1.5);

    // --- Plasma Field Calculation ---
    // Use time-varying offsets and trigonometric functions for shifting color/energy
    float plasma_field = sin(p.x * 2.0 + u_time * 0.8) * 0.5 + 0.5;
    float plasma_field_z = cos(p.y * 1.5 + u_time * 0.6) * 0.5 + 0.5;
    
    // Combine noise and time to create the overall intensity map
    float intensity = (noise_y * 0.5 + noise_x * 0.5 + plasma_field * 0.3 + plasma_field_z * 0.2);
    
    // Smooth and map intensity to 0.0 to 1.0
    intensity = pow(clamp(intensity, 0.2, 1.0), 1.5);
    
    // --- Color Mapping (Mesmerizing Shifts) ---
    
    // 1. Plasma Core Color (Blue/Purple to Yellow/Red)
    vec3 color_core = vec3(
        sin(p.x * 0.5 + u_time * 0.3) * 0.5 + 0.5,
        cos(p.y * 0.6 + u_time * 0.2) * 0.5 + 0.5,
        1.0 - sin(p.x * 0.5 + u_time * 0.3) * 0.5
    );
    
    // 2. Background/Ambient Energy (Deep space blues/purples)
    vec3 color_ambient = vec3(0.1, 0.1, 0.3);
    
    // 3. Energy Glow (High frequency, high contrast)
    float glow = sin(p.x * 8.0 + u_time * 3.0);
    vec3 color_glow = vec3(0.8, 0.8, 1.0) * abs(glow);
    
    // Final Color Mix
    // Weighting the components: Core * Intensity + Glow * Contrast + Ambient * Falloff
    vec3 final_color = mix(color_ambient, color_core, intensity * 0.8);
    final_color += color_glow * (1.0 - intensity * 0.5);
    
    // Apply contrast boost and smooth the output
    final_color = pow(final_color * (1.0 + intensity * 0.5), vec3(0.8));
    
    gl_FragColor = vec4(final_color, 1.0);
}