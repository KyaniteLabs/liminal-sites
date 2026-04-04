#version 330 소

uniform vec2 u_resolution;
uniform float u_time;

// Simple pseudo-random hash function for noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.33, 28.99))) * 43758.5453);
}

// Value noise implementation (simplified for performance)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation (smootherstep)
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Sample the four corners
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Interpolate
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Turbulence function combining multiple noise octaves
float turbulence(vec2 p) {
    float total = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    for (int i = 0; i < 4; ++i) {
        total += noise(p * frequency) * amplitude;
        p *= 2.0;
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return total;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 10.0 + u_time * 0.3;

    // --- 1. Base Turbulence and Movement ---
    float noise_base = turbulence(p);

    // --- 2. Time-Controlled Shifts and Ripples ---
    float ripple_factor = sin(p.y * 0.5 + u_time * 1.2) * 0.5 + 0.5;
    float shift_noise = turbulence(p * 0.5 + u_time * 0.5) * 0.8;

    // Combine factors to create a complex displacement map
    float displacement = noise_base * 0.5 + shift_noise * 0.3 + ripple_factor * 0.2;

    // --- 3. Plasma Color Generation ---
    
    // Map the displacement to different color channels
    // The use of sin/cos helps create smooth, cyclical color shifts
    float r_mix = sin(displacement * 5.0 + u_time * 0.8) * 0.5 + 0.5;
    float g_mix = cos(displacement * 5.0 + u_time * 0.6) * 0.5 + 0.5;
    float b_mix = sin(displacement * 5.0 + u_time * 1.0) * 0.5 + 0.5;

    // Apply a soft falloff/glow effect
    float glow = exp(-length(uv - vec2(0.5)) * 10.0);

    // Final Color Calculation (Multiplying color components by the glow factor)
    vec3 color = vec3(
        r_mix * 0.8 + 0.1,
        g_mix * 0.8 + 0.1,
        b_mix * 0.8 + 0.1
    );
    
    // Increase intensity slightly based on the central displacement
    color *= (1.0 + glow * 0.5);

    // Output the final color
    gl_FragColor = vec4(color, 1.0);
}