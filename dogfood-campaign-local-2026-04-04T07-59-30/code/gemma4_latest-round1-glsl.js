#version 330 소

// Uniforms
uniform vec2 u_resolution;
uniform float u_time;

// Simple pseudo-random hash function for noise generation
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.33, 2.0))) * 43758.5453);
}

// Perlin-like Noise function (using layered coordinates and time)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Smooth interpolation (smoothstep-like)
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Combine four corner hashes
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Bilinear interpolation
    float x1 = mix(a, b, u.x);
    float x2 = mix(c, d, u.x);
    return mix(x1, x2, u.y);
}

// Fractal Brownian Motion (FBM) for complex detail
float fbm(vec2 p, float scale) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; ++i) {
        value += noise(p * frequency * scale) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 10.0; // Scale coordinates
    
    // Time-dependent offset and movement
    float time_offset = u_time * 0.15;
    vec2 animated_p = p + vec2(time_offset, time_offset * 0.8);

    // Generate core plasma structure using FBM
    float noise_val = fbm(animated_p, 1.0) * 0.5 + 0.5;
    
    // Add a secondary, more structured wave pattern
    float wave_val = sin(animated_p.x * 3.0 + u_time * 1.2) * 0.3 + 0.7;
    
    // Combine noise and wave for the primary driving factor
    float plasma_factor = normalize(noise_val - wave_val);
    
    // --- Color Mapping ---
    
    // Plasma colors often involve high contrast, blues, purples, and magentas.
    // Use the plasma_factor to map through a vibrant color cycle.
    
    // 1. Hue calculation based on position and time
    vec3 color_coord = vec3(
        sin(animated_p.x * 0.5 + u_time * 0.5) * 0.5 + 0.5,
        cos(animated_p.y * 0.5 + u_time * 0.3) * 0.5 + 0.5,
        plasma_factor * 0.8 + 0.2
    );
    
    // 2. Use the factor to modulate intensity and color saturation
    float intensity = plasma_factor * 1.5;
    
    // 3. Final Color Mix (Gradient/Shift)
    // Interpolate between deep blue (low intensity) and bright magenta/cyan (high intensity)
    vec3 color_a = vec3(0.0, 0.0, 0.8); // Deep Blue
    vec3 color_b = vec3(1.0, 0.5, 1.0); // Magenta
    
    vec3 final_color = mix(color_a, color_b, intensity);
    
    // Add a subtle glow/bloom effect based on the noise peak
    float glow = pow(max(0.0, plasma_factor - 0.7) * 2.0, 1.5);
    final_color += vec3(0.8, 0.6, 1.0) * glow; // White/Cyan glow overlay

    // Output the result
    gl_FragColor = vec4(final_color, 1.0);
}