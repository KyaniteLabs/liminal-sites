// Plasma Shader
// Requires uniforms:
// uniform float u_time;
// uniform vec2 u_resolution;

#define PI 3.14159265359

// Hash function for pseudo-random numbers
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.2, 37.1))) * 43758.5453);
}

// Simple pseudo-3D noise (Value noise approximation)
float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    // Smoother step interpolation
    vec3 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i.xz + vec2(0.0, 0.0));
    float b = hash(i.xz + vec2(1.0, 0.0));
    float c = hash(i.yz + vec2(0.0, 1.0));
    float d = hash(i.yz + vec2(1.0, 1.0));

    float val = mix(mix(a, b, u.x),
                    mix(c, d, u.x), u.y);
    return val;
}

// Fractal Brownian Motion (FBM) wrapper for complex noise
float fbm(vec3 p, int octaves, float lacunarity, float persistence) {
    float total = 0.0;
    float frequency = 1.0;
    float amplitude = 1.0;
    float maxValue = 0.0; // Used to normalize amplitude

    for (int i = 0; i < octaves; i++) {
        total += noise(p * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return total / maxValue;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec3 p = vec3(uv.x * 2.0 - 1.0, uv.y * 2.0 - 1.0, 0.0);
    float time = u_time * 0.5;

    // --- Core Plasma Calculation ---

    // 1. Base Noise Field (3D input using time)
    // The 'z' dimension is replaced by time to create movement
    float noise_field = fbm(p + vec3(time * 0.1, 0.0, time * 0.2), 
                             4, 2.0, 0.5);
    
    // 2. Secondary Wave/Warping Effect
    // Use a sine wave distortion based on time and coordinates
    float warp_factor = sin(p.x * 5.0 + time * 0.7) * 0.3;
    float wave_noise = fbm(vec3(p.x * 3.0, p.y * 3.0, time * 0.5), 
                            3, 2.1, 0.4) * 0.5;

    // Combine and modulate the noise
    float plasma_intensity = noise_field * 0.7 + wave_noise * 0.3;
    plasma_intensity = pow(plasma_intensity, 1.5); // Sharpen the contrast

    // --- Color Mapping and Animation ---

    // Use the noise intensity to drive color shifts
    vec3 color1 = vec3(0.0, 0.1, 0.7); // Blueish
    vec3 color2 = vec3(0.5, 0.8, 1.0); // Cyan
    vec3 color3 = vec3(1.0, 0.2, 0.0); // Orange/Red

    // Calculate the blending factor based on noise
    float blend_factor = smoothstep(0.2, 0.8, plasma_intensity);
    
    // Introduce time-based color cycling (sinusoidal shift)
    float time_shift = sin(time * 0.5) * 0.5 + 0.5; // Range 0 to 1
    float color_shift = sin(time * 0.3) * 0.3 + 0.7; // Subtle modulation

    // Interpolate colors based on the combined factors
    vec3 base_color = mix(color1, color2, blend_factor * 0.8 + color_shift);
    vec3 final_color = mix(base_color, color3, pow(plasma_intensity, 2.0) * 0.2);

    // Apply overall contrast and glow effect
    float glow = 1.0 - exp(-plasma_intensity * 3.0);
    final_color *= (0.8 + glow * 0.5);

    gl_FragColor = vec4(final_color, 1.0);
}