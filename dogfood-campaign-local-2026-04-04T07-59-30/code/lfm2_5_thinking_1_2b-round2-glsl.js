#version 330 소

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_screen_uv;

// Simple pseudo-random hash function (useful for noise)
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * .1031);
    p3 += dot(p3, p3.yzx);
    return fract((p3.x + p3.y) * (p3.z + 1.0));
}

// Value noise function (simplified for performance)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Interpolate using the hash function
    float n = mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), f.x),
                   mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), f.x), 
                   f.y);
    return n;
}

// Directional noise (simulating flow)
float flow_noise(vec2 p, float t) {
    vec2 offset = vec2(cos(u_time * 0.1) * 0.5, sin(u_time * 0.1) * 0.5);
    return noise(p * 0.5 + offset + vec2(t * 0.1, t * 0.05));
}

// Main plasma calculation
vec3 plasma_effect(vec2 uv, float time) {
    // Scale coordinates for effect size
    vec2 p = uv * 5.0;
    
    // Time-dependent driving coordinates
    float t_scale = time * 0.3;

    // 1. Primary Noise Layer (Base structure)
    float n1 = noise(p * 0.5 + vec2(t_scale * 0.2, 0.0));
    
    // 2. Secondary Noise Layer (Detail and movement)
    float n2 = flow_noise(p * 0.7, t_scale * 0.8);

    // 3. Combine noise into a pseudo-gradient or density field
    // The plasma structure often relies on the interaction of two noise fields.
    float density = sin(n1 * 5.0 + time * 0.5) * 0.5 + 0.5;
    float energy = n2 * 0.5 + 0.5;
    
    // Combine and normalize the structure
    float plasma_value = (density + energy) * 0.8;

    // --- Color Mapping and Animation ---

    // Calculate color based on the plasma value and time
    // Use sine waves for smooth, cyclical color shifts
    float r = sin(plasma_value * 10.0 + time * 0.9) * 0.5 + 0.5;
    float g = sin(plasma_value * 10.0 + time * 1.1) * 0.5 + 0.5;
    float b = sin(plasma_value * 10.0 + time * 0.7) * 0.5 + 0.5;

    // Apply intensity falloff (makes the center glow)
    float falloff = 1.0 - length(uv - 0.5) * 2.0;
    falloff = pow(falloff, 1.5);
    
    // Final color output
    vec3 color = vec3(r, g, b) * plasma_value * falloff * 2.0;

    // Add a subtle glow/bloom effect
    color += vec3(0.1, 0.1, 0.1) * falloff;

    return color;
}

void main() {
    // Normalized UV coordinates (0.0 to 1.0)
    vec2 uv = u_screen_uv;

    // Calculate the final color
    vec3 color = plasma_effect(uv, u_time);

    gl_FragColor = vec4(color, 1.0);
}