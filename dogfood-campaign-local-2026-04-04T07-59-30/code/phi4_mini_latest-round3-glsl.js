#version 330 소
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

// --- Noise Functions (Simple Pseudorandom Hash/Value Noise) ---

// Hash function for repeatable pseudo-random values
float hash( vec2 p ) {
    float n = dot( p, vec2(12.9898, 78.233) );
    return fract( sin( n * 43758.5453) * 123.456 );
}

// 2D Noise function (using simple interpolation/gradient)
float noise( vec2 p ) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoothstep interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Get corner hashes
    float a = hash( i + vec2(0.0, 0.0) );
    float b = hash( i + vec2(1.0, 0.0) );
    float c = hash( i + vec2(0.0, 1.0) );
    float d = hash( i + vec2(1.0, 1.0) );

    // Interpolate
    float x1 = mix( a, b, u.x );
    float x2 = mix( c, d, u.x );
    return mix( x1, x2, u.y );
}

// Octave summation for fractal noise (detail)
float fbm( vec2 p ) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 4; i++) {
        value += noise(p * frequency) * amplitude;
        p *= 2.0; // Increase frequency
        amplitude *= 0.5; // Decrease amplitude
    }
    return value;
}

// --- Main Shader Logic ---

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 6.0 + vec2(u_time * 0.1, u_time * 0.05);

    // Calculate base noise structure (low frequency, smooth movement)
    float n1 = fbm(p * 0.5 + vec2(u_time * 0.2, 0.0)) * 0.5 + 0.5;

    // Calculate detail turbulence (high frequency, rapid movement)
    float n2 = fbm(p * 3.0 + vec2(u_time * 0.4, u_time * 0.1));

    // Combine noise components to form the plasma field
    float plasma_intensity = sin(n1 * 10.0 + u_time * 0.5) * 0.5 + 0.5;
    float turbulence = n2 * 0.5 + 0.5;
    
    // The combined pseudo-potential field
    float plasma_value = plasma_intensity * 0.6 + turbulence * 0.4;

    // --- Color Mapping and Animation ---

    // 1. Shift the color phase based on time and spatial position
    float phase_shift = sin(plasma_value * 10.0 + u_time * 1.5);

    // 2. Map the intensity/phase to HSV or direct color manipulation for vibrant shift
    // Using a simple wave function mapping for cyclical colors
    vec3 color_base = vec3(
        cos(plasma_value * 10.0 + u_time * 0.5),
        cos(plasma_value * 10.0 + u_time * 1.5 + 2.0),
        cos(plasma_value * 10.0 + u_time * 2.5)
    );

    // Normalize and scale the color to a bright, saturated range
    vec3 final_color = color_base * 0.5 + 0.5;

    // Apply the overall plasma shift (making the color pulsate/shift)
    final_color = mix(final_color, vec3(1.0, 0.8, 0.2), abs(sin(u_time * 0.8)));

    // Final output
    gl_FragColor = vec4(final_color, 1.0);
}