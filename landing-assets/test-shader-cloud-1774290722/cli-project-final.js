<think>
The user wants a colorful wave and distortion shader. Let me create something visually striking with:

1. Multiple wave layers with different colors
2. Distortion effects using sine waves and noise
3. Smooth animation over time
4. Colorful palette with vibrant hues
5. Some interaction via mouse if available

I'll create a single fragment shader that includes:
- Time-based wave animations
- Multiple wave layers for depth
- Color gradients that shift over time
- UV distortion for that liquid/wavy feel
- Noise function for organic variation

Let me write this as a complete WebGL 1 fragment shader.
</think>

precision highp float;

#define PI 3.14159265359
#define TAU 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 distort(vec2 uv, float time) {
    float noise1 = fbm(uv * 3.0 + time * 0.3);
    float noise2 = fbm(uv * 2.0 - time * 0.2 + 10.0);
    
    uv.x += sin(uv.y * 8.0 + time * 1.5) * 0.05 * (1.0 + noise1);
    uv.y += cos(uv.x * 6.0 + time * 1.2) * 0.04 * (1.0 + noise2);
    
    uv.x += sin(uv.y * 15.0 + time * 2.5) * 0.015;
    uv.y += cos(uv.x * 12.0 - time * 2.0) * 0.012;
    
    return uv;
}

float wave(vec2 uv, float freq, float amp, float speed, float offset) {
    return sin(uv.x * freq + u_time * speed + offset) * amp;
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 centered = uv - 0.5;
    centered.x *= u_resolution.x / u_resolution.y;
    
    float mouseInfluence = 0.0;
    if(u_mouse.x > 0.0 || u_mouse.y > 0.0) {
        vec2 mouse = u_mouse - 0.5;
        mouse.x *= u_resolution.x / u_resolution.y;
        mouseInfluence = 1.0 / (1.0 + length(centered - mouse) * 8.0);
    }
    
    vec2 distortedUV = distort(uv, u_time * 0.5);
    
    float wave1 = wave(distortedUV, 6.0, 0.08, 1.8, 0.0);
    float wave2 = wave(distortedUV, 10.0, 0.05, 2.5, PI * 0.33);
    float wave3 = wave(distortedUV, 14.0, 0.03, 3.2, PI * 0.66);
    float wave4 = wave(distortedUV, 20.0, 0.02, 4.0, PI);
    
    float combinedWaves = wave1 + wave2 + wave3 + wave4;
    
    float distFromCenter = length(centered);
    float radialWave = sin(distFromCenter * 15.0 - u_time * 2.0) * 0.03;
    combinedWaves += radialWave;
    
    float angle = atan(distortedUV.y, distortedUV.x);
    float angularWave = sin(angle * 6.0 + u_time * 1.5) * 0.02 * (1.0 - distFromCenter);
    combinedWaves += angularWave;
    
    float hue1 = fract(u_time * 0.1 + distFromCenter * 0.5 + distortedUV.x * 0.3);
    float hue2 = fract(hue1 + 0.5 + combinedWaves * 2.0);
    
    float brightness = 0.7 + 0.3 * (1.0 - distFromCenter);
    brightness += combinedWaves * 1.5;
    brightness = clamp(brightness, 0.3, 1.0);
    
    vec3 color1 = hsv2rgb(vec3(hue1, 0.8, brightness));
    vec3 color2 = hsv2rgb(vec3(hue2, 0.7, brightness * 0.9));
    
    float gradientFactor = sin(distFromCenter * TAU + u_time) * 0.5 + 0.5;
    vec3 color = mix(color1, color2, gradientFactor);
    
    float interference = sin(distortedUV.x * 30.0 + u_time * 3.0) * 
                        cos(distortedUV.y * 25.0 - u_time * 2.5);
    color += vec3(0.1, 0.15, 0.2) * interference * 0.15;
    
    float flicker = fbm(uv * 5.0 + u_time * 0.5) * 0.1;
    color += flicker;
    
    float vignette = 1.0 - distFromCenter * 0.8;
    vignette = smoothstep(0.0, 1.0, vignette);
    color *= vignette;
    
    if(mouseInfluence > 0.01) {
        vec3 mouseColor = hsv2rgb(vec3(fract(u_time * 0.15), 0.9, 1.0));
        color = mix(color, mouseColor, mouseInfluence * 0.4);
        color += mouseColor * mouseInfluence * 0.2;
    }
    
    color = pow(color, vec3(0.9));
    color = mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), -0.1);
    
    gl_FragColor = vec4(color, 1.0);
}