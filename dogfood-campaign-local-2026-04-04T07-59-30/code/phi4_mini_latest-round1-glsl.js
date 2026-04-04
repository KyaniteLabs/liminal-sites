#version 330 core

out vec4 fragColor;

uniform vec2 u_resolution;
uniform float u_time;

// Simple pseudo-random hash function for basic noise generation
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.33, 2.0))) * 123.45);
}

// Value noise approximation using multiple hash lookups
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoother interpolation (smoothstep)
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Combine four corner hashes and interpolate
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    float x1 = mix(a, b, u.x);
    float x2 = mix(c, d, u.x);

    return mix(x1, x2, u.y);
}

// Turbulence function combines multiple noise layers for complex fluid look
float turbulence(vec2 p) {
    float v = 0.0;
    float amplitude = 1.0;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        v += noise(p * frequency + vec2(0.0, float(i) * 0.5)) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return v;
}


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0; // Normalize to [-1, 1]

    // Time-based offset for animation
    float t = u_time * 0.3;

    // 1. Generate base plasma structure using noise
    // Use shifted coordinates for swirling motion
    vec2 noise_coord = p * 0.5 + vec2(t * 0.1, t * 0.2);
    float plasma_strength = turbulence(noise_coord);

    // Normalize and apply falloff
    float plasma_mask = pow(abs(plasma_strength) * 0.5 + 0.5, 2.0);
    plasma_mask = smoothstep(0.2, 0.8, plasma_mask);

    // 2. Calculate animated color shifts (Hue cycling)
    // Use sin/cos functions driven by time to create smooth color transitions
    float hue_shift = sin(u_time * 0.5) * 0.5 + 0.5;
    float saturation_shift = cos(u_time * 0.7) * 0.5 + 0.5;
    
    // Combine plasma mask with time-varying factors to modulate color
    vec3 color_base = vec3(0.5 + 0.3 * sin(p.y*1.5 + t));
    
    // Interpolate color based on the plasma mask and time
    vec3 final_color = mix(
        vec3(0.1, 0.5, 1.0) * plasma_mask, // Blueish base
        vec3(1.0, 0.8, 0.2) * plasma_mask, // Yellowish highlight
        sin(u_time * 0.8 + p.x * 5.0) * 0.5 + 0.5 // Secondary time modulation
    );

    // Enhance the effect by modulating intensity with the noise
    final_color *= (1.0 + plasma_mask * 0.5);

    // Final output
    fragColor = vec4(final_color, 1.0);
}