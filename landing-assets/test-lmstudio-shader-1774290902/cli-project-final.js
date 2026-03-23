<think>
The user wants a psychedelic spiral shader with color cycling. Let me create an interesting, smooth animated fragment shader with:

1. Spiral patterns that rotate and pulse
2. Color cycling using hue rotation or sine-based color palettes
3. Time-based animation
4. Optional mouse interaction for interactivity
5. Smooth transitions and organic feel

I'll create concentric spirals with multiple layers, color cycling using HSB/RGB conversion, and some noise for organic variation.
</think>

precision highp float;

#define PI 3.14159265359
#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for(int i = 0; i < 4; i++) {
        value += amplitude * smoothNoise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec2 mouseNorm = u_mouse / u_resolution;
    
    float t = u_time * 0.5;
    
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    
    float spiral1 = sin(angle * 8.0 + dist * 20.0 - t * 3.0 + fbm(uv * 3.0 + t) * 2.0);
    float spiral2 = sin(angle * 5.0 - dist * 15.0 + t * 2.5 + fbm(uv * 2.0 - t * 0.7) * 1.5);
    float spiral3 = sin(angle * 12.0 + dist * 25.0 - t * 4.0);
    
    float combinedSpiral = spiral1 * 0.5 + spiral2 * 0.35 + spiral3 * 0.15;
    
    float pulse = sin(t * 2.0 + dist * 10.0) * 0.5 + 0.5;
    
    float hue = fract(combinedSpiral * 0.15 + t * 0.1 + dist * 0.2 + mouseNorm.x * 0.3);
    float saturation = 0.7 + 0.3 * sin(angle * 3.0 + t);
    float brightness = 0.5 + 0.5 * pulse * combinedSpiral;
    
    vec3 color = hsv2rgb(vec3(hue, saturation, brightness));
    
    float glow = exp(-dist * 2.0) * 0.5;
    vec3 glowColor = hsv2rgb(vec3(fract(t * 0.05 + dist * 0.1), 0.8, glow));
    color += glowColor;
    
    float ring = smoothstep(0.02, 0.01, abs(sin(dist * 30.0 - t * 5.0) - 0.5));
    color += ring * hsv2rgb(vec3(fract(angle / TWO_PI + t * 0.2), 0.6, 0.3));
    
    float interference = sin(angle * 20.0 + t * 4.0) * sin(dist * 40.0 - t * 3.0);
    color += interference * 0.1 * hsv2rgb(vec3(fract(t * 0.08), 0.5, 1.0));
    
    color = pow(color, vec3(0.9));
    color = mix(color, vec3(dot(color, vec3(0.299, 0.587, 0.114))), -0.2);
    
    gl_FragColor = vec4(color, 1.0);
}