#version 330 소
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// Pseudo-random hash function for noise generation
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.333, 2.0))) * 123.45);
}

// Basic value noise (2D)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation curve
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Sample the four corners and interpolate
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    float inter_x1 = mix(a, b, u.x);
    float inter_x2 = mix(c, d, u.x);

    return mix(inter_x1, inter_x2, u.y);
}

// Smooth plasma function combining noise and time
vec3 plasma(vec2 uv, float time) {
    // Normalized coordinates
    vec2 p = uv * 3.0 + vec2(time * 0.1);

    // Layer 1: Large scale, slow movement
    float n1 = noise(p * 0.5 + vec2(time * 0.2, time * 0.1));
    
    // Layer 2: Mid scale, faster movement
    float n2 = noise(p * 1.5 + vec2(time * 0.5, time * 0.3));
    
    // Layer 3: Fine scale, high frequency
    float n3 = noise(p * 3.0 + vec2(time * 1.0, time * 0.7));

    // Combining noise into an energy field
    float intensity = sin(n1 * 3.0 + n2 * 2.0 + n3 * 1.0) * 0.5 + 0.5;
    
    // Calculate plasma core based on noise gradients
    float plasma_value = sin(n1 * 10.0 + time * 0.5) * 0.5 + 0.5;
    float plasma_mask = pow(abs(sin(n2 * 5.0 + time * 0.3)), 2.0);
    
    // Overall plasma concentration
    float final_plasma = plasma_mask * intensity * 1.5;
    final_plasma = smoothstep(0.7, 1.0, final_plasma);

    // --- Color Shifting Logic ---
    
    // Time-based pulsation and color shift
    float pulse = sin(time * 0.8) * 0.5 + 0.5;
    
    // Hue shifts over time (using sine waves for color channels)
    vec3 color_a = vec3(
        sin(p.x * 2.0 + time * 0.5) * 0.5 + 0.5,
        cos(p.y * 2.0 + time * 0.3) * 0.5 + 0.5,
        sin(p.x * 2.0 + time * 0.7) * 0.5 + 0.5
    );
    
    // Mix the core plasma color with the time-shifted color
    vec3 final_color = mix(color_a, vec3(1.0, 0.5, 0.2), final_plasma);
    
    // Apply overall pulsing and glow
    final_color *= pulse * 1.2 + 0.8;

    // Increase contrast and saturation
    final_color = pow(final_color, vec3(1.2));

    return final_color;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 color = plasma(uv, u_time);
    gl_FragColor = vec4(color, 1.0);
}