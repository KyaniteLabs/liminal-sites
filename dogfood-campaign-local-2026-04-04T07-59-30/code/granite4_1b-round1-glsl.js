#version 330 소

uniform float u_time;
uniform vec2 u_resolution;

// Basic hash function for pseudo-randomness
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.3, 28.9))) * 43758.5453);
}

// Simple pseudo-noise function (approximation of Perlin/Simplex)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation curve
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Get corner values
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Interpolate
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Octave function to combine multiple noise frequencies
float fbm(vec2 p, int octaves) {
    float result = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    for (int i = 0; i < octaves; i++) {
        result += noise(p * (frequency + 1.0)) * amplitude;
        frequency += 2.0;
        amplitude *= 0.5;
    }
    return result;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 5.0;

    // Time-based offset for animation
    float time_offset = u_time * 0.15;

    // Combine time and space to create the dynamic input for noise
    vec2 noise_input = vec2(p.x * 0.8 + time_offset, p.y * 0.8 + time_offset * 0.5);

    // Generate multiple layers of noise for complexity
    float n1 = fbm(noise_input * 0.8, 4);
    float n2 = fbm(noise_input * 1.5 + vec2(1.0, 0.0), 5);
    float n3 = fbm(noise_input * 0.5 + vec2(0.0, 1.0), 4);

    // Combine noise values to define core plasma structure
    float plasma_value = (n1 * 0.5 + n2 * 0.3 + n3 * 0.2);

    // Smooth the value and normalize it
    float intensity = smoothstep(0.1, 0.9, plasma_value);

    // --- Color Mapping (Plasma Look) ---

    // Use the intensity and time to drive color shifts
    vec3 color_shift = vec3(
        sin(plasma_value * 10.0 + u_time * 0.5) * 0.5 + 0.5,
        cos(plasma_value * 10.0 + u_time * 0.3) * 0.5 + 0.5,
        sin(plasma_value * 10.0 + u_time * 0.7) * 0.5 + 0.5
    );

    // Mix the shifted color with the intensity
    vec3 final_color = color_shift * intensity * 1.5;

    // Add a subtle glow/falloff effect
    final_color *= pow(intensity, 0.8);

    // Final output color
    gl_FragColor = vec4(final_color, 1.0);
}