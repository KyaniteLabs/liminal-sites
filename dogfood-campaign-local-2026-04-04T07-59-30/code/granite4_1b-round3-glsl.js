#version 330 소

uniform float u_time;
uniform vec2 u_resolution;

// Hash function for pseudo-random values
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.33, 2.23))) * 43758.5453);
}

// Value Noise (simplified implementation for shader use)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation curve
    vec2 t = f * f * (3.0 - 2.0 * f);

    // Sample corners
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Interpolate
    float val = mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
    return val;
}

// Flow field noise (combines noise and time for movement)
float flow_noise(vec2 p, float t) {
    vec2 offset = vec2(t * 0.1, t * 0.05);
    float n1 = noise(p + offset);
    float n2 = noise(p * 0.5 + vec2(t * 0.2, t * 0.1));
    float n3 = noise(p * 0.8 - vec2(t * 0.3, t * 0.2));
    
    // Combine them with sine/cosine to create a smoother, directional flow
    return sin(n1 * 10.0 + t * 0.5) * 0.5 + 0.5;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 8.0; // Zoom level

    // Time-based flow calculation
    float time_factor = u_time * 0.5;
    float flow = flow_noise(p, time_factor);

    // Use two noise layers for complexity
    float noise_a = noise(p * 0.8 + vec2(time_factor * 0.1, time_factor * 0.2));
    float noise_b = noise((p + vec2(time_factor * 0.3, 0.0)) * 0.6);

    // Combine noise and flow: plasma intensity is driven by the gradient
    float plasma_intensity = abs(sin(flow * 10.0) * 0.5 + 0.5);
    
    // Use a smooth combination of noise and flow for the primary pattern
    float pattern = pow(plasma_intensity * 0.7 + noise_a * 0.3, 1.2);
    
    // --- Color Mapping ---
    
    // Smoothly blend the pattern to create color shifts
    vec3 color_r = vec3(
        sin(pattern * 10.0 + time_factor * 0.5) * 0.5 + 0.5,
        cos(pattern * 7.0 + time_factor * 0.7) * 0.5 + 0.5,
        sin(pattern * 12.0 + time_factor * 0.3) * 0.5 + 0.5
    );
    
    // Apply a global color shift based on time (e.g., a pulsing hue)
    float time_pulse = sin(u_time * 0.2) * 0.2 + 0.8;
    
    vec3 final_color = color_r * time_pulse;

    // Final output color
    gl_FragColor = vec4(final_color, 1.0);
}