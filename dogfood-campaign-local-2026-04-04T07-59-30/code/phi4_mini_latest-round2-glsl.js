#version 330 소

uniform float u_time;
uniform vec2 u_resolution;

// Hash function for pseudo-random numbers
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.34, 28.69))) * 123.45);
}

// Value noise implementation (optimized 2D)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation (Smootherstep)
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Deterministic gradient lookups
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Function to generate smooth, oscillating plasma-like pattern
float plasma_field(vec2 uv, float time) {
    // Scale coordinates for effect size
    vec2 p = uv * 2.0;

    // Layer 1: Base turbulence (slow shift)
    float n1 = noise(p * 0.1 + time * 0.05);
    
    // Layer 2: Mid-frequency shifting wave (fast shift)
    float n2 = sin(p.x * 0.5 + time * 1.5) * 0.5 + 0.5;
    
    // Layer 3: High-frequency detail (small scale flicker)
    float n3 = noise(p * 1.5 + time * 3.0);

    // Combine layers using trigonometry to create smooth, oscillating patterns
    float combined = (sin(n1 * 10.0 + time * 0.8) * 0.5 + 0.5) * 
                      (cos(n2 * 5.0 + time * 0.3) * 0.5 + 0.5) * 
                      (n3 * 0.8 + 0.2);

    return combined;
}

void main() {
    // Normalize coordinates to the range [-0.5, 0.5]
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0;

    float time = u_time * 0.8;

    // Generate the core plasma value (0.0 to 1.0)
    float plasma_val = plasma_field(p, time);

    // --- Color Mapping ---

    // 1. Base Color Shift (Gradient based on plasma intensity)
    // Plasma intensity maps through a shifting gradient (e.g., blue -> purple -> orange)
    vec3 color1 = vec3(
        0.1 + 0.2 * sin(plasma_val * 10.0 + time * 0.5), // R
        0.2 + 0.1 * cos(plasma_val * 10.0 + time * 0.3), // G
        0.5 + 0.3 * sin(plasma_val * 10.0 + time * 0.7)  // B
    );

    // 2. Secondary Swirl/Detail (High contrast, rapid color oscillation)
    float detail_mix = noise(p * 0.5 + time * 2.0) * 0.5 + 0.5;
    vec3 color2 = vec3(
        0.8 * detail_mix, 
        0.3 + 0.6 * sin(time * 2.0 + p.y * 0.5),
        0.1 + 0.4 * cos(time * 1.5 + p.x * 0.5)
    );
    
    // 3. Blending and Final Output
    // The final color is a weighted blend of the base field and the detail layer.
    vec3 final_color = mix(color1, color2, detail_mix * 0.8);

    // Apply a subtle darkening/enhancement based on the primary plasma value
    float final_intensity = plasma_val * 0.8 + 0.2;
    final_color *= final_intensity;

    // Output the final color
    gl_FragColor = vec4(final_color, 1.0);
}