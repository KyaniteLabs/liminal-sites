# Reasoning Trace: cloud-minimax-glsl-minimax-m25

**Model:** undefined
**Timestamp:** 2026-04-07T18:49:39.017Z
**Recovered from thinking:** false

## Prompt

Generate shader code for:

Create an abstract plasma shader with animated colors

RULES: code only, no explanations.

## Thinking/Reasoning

```
The user wants a shader with animated colors creating an abstract plasma effect.

I need to output only shader code, no explanations. I'll provide GLSL code for a plasma shader, likely a fragment shader that can be used in various contexts (like Shadertoy, Processing, etc.).

I'll write a fragment shader that creates a plasma effect using sine waves and time-based animation.
```

## Generated Code

```
#version 330 core

out vec4 fragColor;
in vec2 fragCoord;
uniform float iTime;
uniform vec2 iResolution;

void main() {
    vec2 uv = fragCoord / iResolution.xy;
    float t = iTime * 0.5;
    
    vec2 p = uv * 8.0;
    
    float v1 = sin(p.x + t);
    float v2 = sin(p.y + t);
    float v3 = sin(p.x + p.y + t);
    float v4 = sin(sqrt(p.x*p.x + p.y*p.y) + t);
    
    float v = v1 + v2 + v3 + v4;
    
    vec3 col;
    col.r = sin(v * 3.14159);
    col.g = sin(v * 3.14159 + 2.094);
    col.b = sin(v * 3.14159 + 4.188);
    
    col = col * 0.5 + 0.5;
    col = pow(col, vec3(0.9));
    
    fragColor = vec4(col, 1.0);
}
```
