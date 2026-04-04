#version 330 소
precision mediump float;

uniform float u_time;
uniform vec2 u_resolution;

// Hash function for pseudo-random noise
float hash(float n) {
    return fract(sin(n) * 43758.5453);
}

// Simple 2D noise based on coordinates
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i.x + i.y * 57.0);
    float b = hash(i.x + (i.y + 1.0) * 57.0);
    float c = hash((i.x + 1.0) + i.y * 57.0);
    float d = hash((i.x + 1.0) + (i.y + 1.0) * 57.0);
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Octave noise combination (for fractal detail)
float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < octaves; i++) {
        value += noise(p * frequency) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Center coordinates and scale
    vec2 p = uv * 2.0 - 1.0;
    p.x *= u_resolution.x / u_resolution.y;
    
    float time_factor = u_time * 0.15;
    
    // --- Plasma Field Generation ---
    
    // 1. Main Wave/Flow (Uses time and position)
    float wave1 = sin(p.y * 3.0 + time_factor * 0.5) * 0.5;
    float wave2 = cos(p.x * 2.0 + time_factor * 0.8) * 0.5;
    
    // 2. Noise Flow (Creates the turbulence and structure)
    vec2 noise_coords = p * 1.5 + vec2(time_factor * 0.2, time_factor * 0.3);
    float noise_val = fbm(noise_coords, 4);
    
    // Combine waves and noise into a single displacement/energy map
    float plasma_energy = (wave1 * 0.5 + wave2 * 0.5 + noise_val * 0.3);
    
    // Normalize and amplify the plasma effect
    float plasma_factor = pow(abs(plasma_energy) * 1.5 + 0.5, 1.2);
    
    // --- Color Mapping and Animation ---
    
    // Calculate the primary color shift based on energy
    // We use sin/cos of coordinates and time to get smooth, cyclic color changes
    float r_shift = sin(p.x * 1.5 + time_factor * 0.4) * 0.5 + 0.5;
    float g_shift = cos(p.y * 1.5 + time_factor * 0.3) * 0.5 + 0.5;
    float b_shift = sin(p.x * 0.8 + p.y * 0.8 + time_factor * 0.6) * 0.5 + 0.5;
    
    // Combine the shifts and the plasma factor to create the final color
    vec3 color = vec3(
        r_shift * plasma_factor * 1.5,
        g_shift * plasma_factor * 1.5,
        b_shift * plasma_factor * 1.5
    );
    
    // Soft clamping and scaling
    color = pow(color, vec3(0.8));
    
    // Final output color
    gl_FragColor = vec4(color, 1.0);
}