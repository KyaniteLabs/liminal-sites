#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

// --- Noise Function (Value Noise approximation) ---
// Based on hashing and trigonometric functions for smooth, repeatable noise
float hash12(vec2 p) {
    return fract(sin(dot(p, vec2(41.23, 1.33))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Smooth interpolation = 6t^5 - 15t^4 + 10t^3
    vec2 t = f * f * (3.0 - 2.0 * f);

    float a = hash12(i + vec2(0.0, 0.0));
    float b = hash12(i + vec2(1.0, 0.0));
    float c = hash12(i + vec2(0.0, 1.0));
    float d = hash12(i + vec2(1.0, 1.0));

    float v0 = mix(a, b, t.x);
    float v1 = mix(c, d, t.x);
    
    return mix(v0, v1, t.y);
}

// --- Fractal/Octave Noise combination ---
float fbm(vec2 p, float scale, float persistence) {
    float max_value = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    float total = 0.0;
    
    for (int i = 0; i < 5; i++) {
        total += noise(p * frequency * scale) * amplitude;
        max_value += amplitude * persistence;
        amplitude *= persistence;
        frequency *= 2.0;
    }
    return total / max_value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 10.0; // Zoom level

    // 1. Plasma Flow Field Calculation
    float noise_value = fbm(p * 0.5, 1.0, 0.5);
    
    // Add time-based offset to simulate movement
    float flow_x = noise(p * 0.5 + u_time * 0.2);
    float flow_y = noise(p * 0.5 + u_time * 0.3);

    // Combine noise fields to create turbulent energy
    float energy_field = abs(noise_value) + 
                          (sin(p.x * 0.5 + u_time * 0.5) * 0.3) +
                          (cos(p.y * 0.5 + u_time * 0.4) * 0.3);

    // 2. Color and Intensity Mapping
    
    // Use smoothstep to define boundaries/cores
    float plasma_intensity = smoothstep(0.2, 0.8, energy_field);

    // Calculate core brightness (higher intensity = brighter glow)
    float glow = pow(plasma_intensity, 2.0); 
    
    // 3. Animated Color Shifts
    
    // Base color components derived from position and time
    vec3 color_r = 0.5 + 0.5 * sin(p.y * 0.1 + u_time * 0.1);
    vec3 color_g = 0.5 + 0.5 * cos(p.x * 0.1 + u_time * 0.05);
    vec3 color_b = 0.5 + 0.5 * sin(p.x * 0.1 + p.y * 0.05 + u_time * 0.15);

    // Combine the base colors and modulate them by the energy field
    vec3 final_color = vec3(
        color_r * glow,
        color_g * glow * 1.2, // Boost green slightly
        color_b * glow * 0.8
    );

    // 4. Final Output
    // Add a deep background color for contrast
    vec3 background = vec3(0.01, 0.01, 0.03);
    
    // Multiply the color by the glow and add the background
    vec3 final_rgb = background + final_color * plasma_intensity * 2.0;

    // Clamp and output
    fragColor = vec4(final_rgb, 1.0);
}