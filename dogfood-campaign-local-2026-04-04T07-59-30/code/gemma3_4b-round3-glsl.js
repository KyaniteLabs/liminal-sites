#version 330 소

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_camera_pos;

// Simple pseudo-random hash function for noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(41.33, 2.12))) * 43758.5453);
}

// Value noise function (approximating Perlin/Worley)
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    
    // Smootherstep interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 3D time-based noise
float fluid_noise(vec3 p) {
    float n1 = noise(p.xy + vec2(0.0, 0.0));
    float n2 = noise(p.xy + vec2(1.0, 0.0));
    float n3 = noise(p.xy + vec2(0.0, 1.0));
    float n4 = noise(p.xy + vec2(1.0, 1.0));
    
    // Simple weighted average blend
    return sin(n1) * 0.5 + cos(n2) * 0.5 + sin(n3) * 0.5 + cos(n4) * 0.5;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 8.0; // Zoom level
    
    // Time offset for animation
    float t = u_time * 0.3;
    
    // Calculate the base plasma value using 3D noise
    float plasma_value = fluid_noise(vec3(p.x * 0.5, p.y * 0.5, t));
    
    // Enhance the effect with sine waves and spatial frequencies
    float wave_1 = sin(p.y * 1.5 + t * 1.2) * 0.5;
    float wave_2 = cos(p.x * 1.2 - t * 0.8) * 0.5;
    
    float combined_effect = plasma_value * 0.8 + wave_1 * 0.2 + wave_2 * 0.2;
    
    // Normalize the combined value to a range [0, 1]
    float intensity = smoothstep(-1.5, 1.5, combined_effect + 1.0);
    
    // Apply contrast and modulation for visual depth
    float final_intensity = pow(intensity * 1.5, 1.2);
    
    // --- Color Mapping (Mesmerizing Color Shift) ---
    
    // Use the final intensity combined with time for color calculation
    float r_factor = sin(p.x * 0.5 + t * 0.5) * 0.5 + 0.5;
    float g_factor = sin(p.y * 0.5 + t * 0.7) * 0.5 + 0.5;
    float b_factor = cos((p.x + p.y) * 0.3 + t * 0.9) * 0.5 + 0.5;
    
    // Mix base color based on intensity
    vec3 color = vec3(
        r_factor * final_intensity * 1.5,
        g_factor * final_intensity * 1.5,
        b_factor * final_intensity * 1.5
    );
    
    // Apply gamma correction and clamp
    color = pow(color, vec3(0.8));
    
    gl_FragColor = vec4(color, 1.0);
}