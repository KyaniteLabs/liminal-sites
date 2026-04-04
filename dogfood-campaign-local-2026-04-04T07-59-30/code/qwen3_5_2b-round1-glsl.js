#version 450

in vec2 uv;
uniform float time;
uniform vec2 u_resolution;

out vec4 fragColor;

// Simple pseudo-random noise function
float noise(vec2 uv) {
    float n = 0.0;
    float a = sin(uv.x * 12.9898 + 0.5);
    float b = sin(uv.y * 12.9898 + 1.0);
    n = abs(a * 0.5) + abs(b * 0.5);
    return n * 0.5;
}

// Glow function
vec3 glow(vec2 uv) {
    float intensity = pow(uv.x * 0.5 + 1.0, 2.0);
    return vec3(1.0, intensity * 0.5 + 0.5, 0.5);
}

void main() {
    // Get time from time uniform
    float t = time * 0.1;
    // Color animation
    vec3 c = vec3(1.0, 0.5, 0.0);
    c = mix(c, vec3(0.0, 0.0, 0.0), t * 0.5);
    // Noise overlay
    float n = noise(uv + t);
    // Final color
    fragColor = vec4(c + glow(uv) * n * 0.5, 1.0);
}