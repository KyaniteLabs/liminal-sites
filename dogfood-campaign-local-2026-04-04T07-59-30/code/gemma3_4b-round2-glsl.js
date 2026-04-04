#version 330 소

uniform float time;
uniform vec2 resolution;

// Basic pseudo-random function
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.32, 37.51))) * 123.45);
}

// Simplex/Perlin-like noise helper (simplified 2D implementation)
// This function provides the necessary smooth, complex input for plasma
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoothstep interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Fractional Brownian Motion (FBM) for complex, swirling patterns
float fbm(vec2 p, float octaves, float lacunarity, float persistence) {
    float total = 0.0;
    float frequency = 0.0;
    float amplitude = 1.0;
    float maxValue = 0.0; // Used to normalize
    
    for (float i = 0.0; i < octaves; i++) {
        total += noise(p * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return total / maxValue;
}

void main() {
    // Normalized coordinates
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    
    // Panning and time offset for animation
    vec2 p = uv * 5.0 + vec2(time * 0.1, time * 0.05);

    // --- Plasma Pattern Generation ---
    
    // Layer 1: Deep, slow-moving base noise (low frequency, high persistence)
    float noise1 = fbm(p * 0.5, 4.0, 2.0, 0.5);

    // Layer 2: Mid-frequency swirling movement (sinusoidal waves + noise)
    float wave_x = sin(p.y * 3.0 + time * 0.3) * 0.5;
    float wave_y = cos(p.x * 2.5 + time * 0.15) * 0.5;
    float noise2 = fbm(p * 1.5 + vec2(time * 0.2, 0.0), 3.0, 2.1, 0.55);

    // Layer 3: High-frequency, volatile detail (fast movement)
    float noise3 = fbm(p * 4.0 + vec2(time * 0.5, time * 0.3), 4.0, 2.2, 0.3);
    
    // Combine the layers to create the primary plasma field strength
    float plasma_field = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);
    
    // Normalize the field to a range [0, 1]
    float strength = pow(abs(plasma_field), 1.5);
    
    // --- Color Mapping (Animated Hue Shift) ---
    
    // The color is mapped based on the combined strength and time
    // Use the strength to determine the intensity/brightness (Luminosity)
    float intensity = strength * 1.5 + 0.5; 
    
    // Use sine waves based on coordinates and time to create cyclic color shifts (Hue)
    // The phase shift (time) drives the animation
    float r_shift = sin(p.x * 5.0 + time * 0.4) * 0.5 + 0.5;
    float g_shift = cos(p.y * 5.0 + time * 0.6) * 0.5 + 0.5;
    float b_shift = sin(p.x * 3.0 + p.y * 2.0 + time * 0.8) * 0.5 + 0.5;
    
    // Map the shifted values to the final colors, modulated by the plasma strength
    vec3 color_r = r_shift * intensity;
    vec3 color_g = g_shift * intensity;
    vec3 color_b = b_shift * intensity;
    
    // Final color calculation: Mix the strong color shifts with the noise field
    vec3 final_color = vec3(
        pow(color_r, 1.1) * 0.8 + strength * 0.2,
        pow(color_g, 1.1) * 0.8 + strength * 0.2,
        pow(color_b, 1.1) * 0.8 + strength * 0.2
    );
    
    // Simple exponentiation for bloom/glow effect
    final_color = pow(final_color, vec3(0.8));

    gl_FragColor = vec4(final_color, 1.0);
}