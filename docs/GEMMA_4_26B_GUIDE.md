# Gemma 4 26B A4B - Inference Guide

**Last Updated:** 2026-04-03

## Model Overview

| Spec | Value |
|------|-------|
| **Architecture** | Mixture-of-Experts (MoE) |
| **Total Parameters** | 26B |
| **Active Parameters** | 3.8B (hence "A4B") |
| **Context Window** | 256K tokens |
| **Modalities** | Text + Image |
| **Optimal For** | Coding, reasoning, multimodal tasks |

## Optimal Inference Parameters

Based on Google's official recommendations:

```javascript
{
  temperature: 1.0,    // Default creative balance
  top_p: 0.95,         // Nucleus sampling
  top_k: 64,           // Top-k sampling
  max_tokens: 4096     // Adjust as needed
}
```

### Parameter Variations by Use Case

| Use Case | Temperature | Top_P | Notes |
|----------|-------------|-------|-------|
| **Code generation** | 0.7 | 0.9 | More deterministic |
| **Creative writing** | 1.2 | 0.98 | More varied |
| **Reasoning** | 1.0 | 0.95 | Balanced (default) |
| **Deterministic** | 0.3 | 0.8 | For structured output |

## Prompting Strategies

### The Formatting Problem

Gemma tends to wrap output in markdown code blocks (```). To get raw code:

**❌ Bad:**
```
System: You are a helpful assistant.
User: Create a p5.js sketch.
```

**✅ Good:**
```
System: You output ONLY raw code. No markdown, no code blocks, no explanations.
User: Create a p5.js sketch.
Rules:
- Output ONLY valid JavaScript
- NO markdown code blocks
- NO backticks
- NO explanations
```

### Recommended System Prompts

**For Code Generation:**
```
You are a code generator. Output ONLY raw code without markdown formatting.
Never use code blocks, backticks, or explanatory text.
```

**With Thinking Mode:**
```
<|think|>You are a precise code generator. Think step by step then output only raw code.
```

## Multimodal (Vision) Usage

### Critical: Order Matters!

**Image must come BEFORE text in the prompt:**

```javascript
messages: [
  {
    role: 'user',
    content: [
      { type: 'image_url', image_url: { url: 'data:image/png;base64,...' } },
      { type: 'text', text: 'Describe this image' }
    ]
  }
]
```

### Vision Token Budgets

Gemma supports variable image resolution:

| Tokens | Use Case |
|--------|----------|
| 70-140 | Classification, captioning, fast video |
| 280-560 | General chat, charts, screens, UI |
| 1120 | OCR, documents, small text |

**Recommendation:** Use 280-560 for most creative coding tasks.

## Performance Expectations

| Metric | Value |
|--------|-------|
| **Inference speed** | ~44-47 tok/s (RTX 4090, 128K context) |
| **Long context** | ~42 tok/s (vision @ 64K) |
| **With speculative decoding** | Up to 300 tok/s |
| **Memory** | Fits in 12GB VRAM with Q4_K_M quantization |

## Context Window Strategy

With 256K tokens, Gemma excels at:
- Large codebase analysis
- Long document processing
- Multi-turn conversations with history

**Best Practice:** Don't include thinking content in conversation history. Strip `<|channel>thought...<channel|>` blocks before next turn.

## LM Studio Configuration

```json
{
  "model": "gemma-4-26b-a4b-it",
  "context_length": 32768,  // Or up to 256K if you have RAM
  "temperature": 1.0,
  "top_p": 0.95,
  "top_k": 64,
  "repeat_penalty": 1.0
}
```

## Troubleshooting

### Issue: Output wrapped in markdown
**Fix:** Use strict system prompt banning markdown

### Issue: Slow generation
**Fix:** 
- Reduce context window
- Use lower quantization (Q4 vs Q8)
- Enable speculative decoding if available

### Issue: Out of memory with vision
**Fix:** Reduce image token budget or use lower context

## Comparison with Other Models

| Model | Params | Speed | Multimodal | Best For |
|-------|--------|-------|------------|----------|
| **Gemma 4 26B A4B** | 26B (3.8B active) | Medium | ✅ | Coding, reasoning, vision |
| **Gemma 4 31B** | 31B dense | Slower | ✅ | Maximum quality |
| **Qwen 3.5 0.8B** | 0.8B | Fast | ❌ | Quick tasks, edge |
| **LFM 2.5 1.2B** | 1.2B | Fast | ❌ | Balanced local use |

## Key Takeaways

1. **A4B = Active 4B** - Only 3.8B params active per token, making it faster than dense 26B
2. **Strict prompting required** - Must explicitly forbid markdown to get raw code
3. **Image before text** - Critical for multimodal prompts
4. **256K context** - Excellent for large codebases
5. **Thinking mode** - Use `<|think|>` for reasoning tasks

## References

- [Gemma 4 Model Card](https://ai.google.dev/gemma)
- [Hugging Face Gemma 4](https://huggingface.co/google/gemma-4-26b-a4b-it)
- [Unsloth Gemma 4 Guide](https://unsloth.ai/docs/models/gemma-4)
- [Gemma Cookbook](https://github.com/google-gemma/cookbook)
