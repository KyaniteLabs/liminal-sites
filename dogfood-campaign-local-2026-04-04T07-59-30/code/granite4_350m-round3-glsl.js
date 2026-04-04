#version 330 소

uniform vec2 u_resolution;
uniform float u_time;

// Pseudo-random noise function (Hash-based)
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(41.33, 2.0))) * 123.456789);
}

// Value noise (smoother, 2D)
float value_noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoothstep interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(vec2(0.0, 1.0) + i);
    float d = noise(vec2(1.0, 1.0) + i);

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Flow field generation using noise and time
vec3 plasma_flow(vec2 uv, float time) {
    // Scale the coordinates and incorporate time for movement
    vec2 p1 = uv * 0.8 + vec2(time * 0.1, time * 0.2);
    vec2 p2 = uv * 0.6 + vec2(-time * 0.2, time * 0.15);

    // Use multiple noise layers for complexity
    float n1 = value_noise(p1 * 0.5);
    float n2 = value_noise(p2 * 0.7);
    float n3 = value_noise(p1 * 0.3 + p2 * 0.3 + vec2(time * 0.1, time * 0.1));

    // Combine noise values to simulate fluid motion/density
    float density = n1 * 0.6 + n2 * 0.3 + n3 * 0.1;

    // Calculate velocity fields (simulating swirling plasma)
    vec2 flow = normalize(vec2(sin(p1.y * 0.5) * 0.5 + cos(p2.x * 0.5) * 0.5,
                               cos(p1.x * 0.5) * 0.5 + sin(p2.y * 0.5) * 0.5));

    // Scale flow by density to create localized eddies
    return flow * (density * 2.0 + 0.5);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 2.0 - 1.0; // Normalize coordinates to [-1, 1]

    // 1. Calculate the flow vector
    vec3 flow_vec = plasma_flow(uv, u_time);

    // 2. Calculate the Plasma Intensity/Structure map
    // Use the flow vector to perturb the UV coordinates
    vec2 plasma_uv = uv + flow_vec.xy * 0.5;

    // Re-calculate a density map using the perturbed coordinates
    float density = 0.0;
    float scale = 10.0;
    for (int i = 0; i < 4; ++i) {
        float n = value_noise(plasma_uv * float(i) * 0.5 + vec2(u_time * 0.1 * float(i), 0.0));
        density += n * 0.25;
    }
    density = pow(max(0.0, density - 0.4) * 1.5, 1.5); // Smooth and enhance structure

    // 3. Color Animation (Chromatic Dispersion & Time Shift)

    // Base color shift based on time and position
    vec3 color_base = 0.5 + 0.5 * cos(vec3(uv.x * 5.0, uv.y * 5.0, u_time * 0.3));

    // Create a vibrant, shifting color palette
    vec3 color_r = sin(uv.x * 10.0 + u_time * 0.5) * 0.5 + 0.5;
    vec3 color_g = cos(uv.y * 10.0 + u_time * 0.7) * 0.5 + 0.5;
    vec3 color_b = sin(uv.x * 8.0 - u_time * 0.3) * 0.5 + 0.5;

    // Mix the color components to simulate plasma energy
    vec3 plasma_color = mix(vec3(color_r), vec3(color_g), density);
    plasma_color = mix(plasma_color, vec3(color_b), density * 0.8);


    // 4. Final Output
    // Use the density map to modulate the color intensity (glow effect)
    float glow = smoothstep(0.3, 0.0, density) * 1.5;

    vec3 final_color = plasma_color * glow;

    // Apply a subtle darkening falloff near edges
    float vignette = 1.0 - length(uv) * 0.5;
    final_color *= vignette;

    gl_FragColor = vec4(final_color, 1.0);
}