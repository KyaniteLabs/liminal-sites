# minimax-glsl-minimax-m27

**Model:** undefined
**Duration:** 17569ms

## Prompt

Generate shader code for:

Create an abstract plasma shader

RULES: code only, no explanations.

## Reasoning

```
The user wants: "Generate shader code for: Create an abstract plasma shader. RULES: code only, no explanations."

We must comply with policy: This is code generation request for a shader. There's no disallowed content. It's permissible.

We must output just code, no explanations.

We need to decide which language? The user said "shader code". Usually GLSL. Could be also HLSL or other. But we can output GLSL, which is typical.

We need to create an abstract plasma shader. Provide all typical uniforms: iResolution, iTime, iMouse, etc.

Potential complexity: Should we provide a full fragment shader with mainImage function, plus a simple vertex shader? Usually just the fragment shader is enough, but we can include a full program.

We need to output code only, no explanation. Ensure no extra text. Should not include markdown code fences? The user said "code only, no explanations". We could output the code directly, no markdown formatting. But maybe it's okay to include code fences? They said code only, no explanations, maybe they want just code. But often providing code fences is okay; it's still code. But to be safe, output raw code without fences.

I'll generate a full GLSL fragment shader with a standard mainImage function and a minimal vertex shader.

The shader: generate abstract plasma using sine functions, mixing colors.

Will use iResolution, iTime.

Add optional iMouse for interactivity.

Will produce color based on sin(distance) etc.

Will include comment lines? The user said no explanations, but comments could be considered explanations. We can include minimal comments but better to avoid.

Thus output just code:

```glsl
// Fragment shader code...
```

But maybe they want just raw code without comments.

I think it's safe to provide a simple shader:

```
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
out vec4 fragColor;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.5;
    float p = sin(uv.x*10.0 + t) + sin(uv.y*10.0 + t);
    float q = sin(sqrt(dot(uv,uv))*10.0 - t);
    float r = sin(length(uv)*10.0 - t*2.0);
    float plasma = (p + q + r) / 3.0;

    vec3 color = 0.5 + 0.5 * cos(plasma * 3.0 + vec3(0.0, 2.0, 4.0));
    fragColor = vec4(color,1.0);
}
```

But we need to include uniform names as typical shader playground? Use iTime etc.

Better to use standard names: iResolution, iTime, iMouse, etc. Provide mainImage function and call it from main.

Example:

```
#version 330 core
out vec4 _fragColor;
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform int iFrame;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform float iSampleRate;
uniform vec4 iDate;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord - 0.5*iResolution.xy)/iResolution.y;
    float t = iTime*0.5;
    float v = sin(uv.x*10.0+t) + sin(uv.y*10.0+t) + sin(10.0*length(uv)+t);
    v = v * 0.3333;
    vec3 col = 0.5 + 0.5*cos(v*6.2831 + vec3(0.0,2.0,4.0));
    fragColor = vec4(col,1.0);
}
```

This is good.

We also need to provide a vertex shader:

```
#version 330 core
in vec4 aPos;
void main()
{
    gl_Position = aPos;
}
```

But maybe not needed.

Given user request: "Generate shader code for: Create an abstract plasma shader" RULES: code only, no explanations.

Thus output just the fragment shader. Could include the vertex shader. The safest is to provide both in one code block or separate.

I will output only the fragment shader with the standard i* uniforms, with mainImage, no extra comments.

Thus final answer: raw GLSL code. Let's produce that.
```

## Code

```javascript
uniform vec3 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform int iFrame;
uniform float iTimeDelta;
uniform float iFrameRate;
uniform float iSampleRate;
uniform vec4 iDate;
uniform float iChannelTime[4];
uniform vec3 iChannelResolution[4];
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = (fragCoord - 0.5 * iResolution.xy) / iResolution.y;
    float t = iTime * 0.5;
    float v = sin(uv.x * 10.0 + t) + sin(uv.y * 10.0 + t) + sin(10.0 * length(uv) + t);
    v *= 0.3333;
    vec3 col = 0.5 + 0.5 * cos(v * 6.2831 + vec3(0.0, 2.0, 4.0));
    fragColor = vec4(col, 1.0);
}
```
