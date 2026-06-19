# TextGenerativeGenerator Usage Examples

## Quick Start

```typescript
import { TextGenerativeGenerator } from 'liminal';

const gen = new TextGenerativeGenerator();

// Simple concrete poetry
const poem = await gen.generate("dripping water");
console.log(poem);
```

## With Options

```typescript
const result = await gen.generate("neon city anxiety", {
  form: 'cascade',
  style: 'chaotic',
  maxLines: 25,
  maxWidth: 50,
  unicode: true,
});
```

## Model-Specific Configuration

### For 1.2B models (fast, simple)
```typescript
const gen = new TextGenerativeGenerator({
  model: 'lfm2.5-1.2b-instruct',
  baseUrl: 'http://localhost:1234/v1',
});

// Automatically uses tiny tier defaults:
// - form: 'concrete'
// - maxLines: 20
// - unicode: false
```

### For 9B models (balanced)
```typescript
const gen = new TextGenerativeGenerator({
  model: 'qwen3.5-9b',
  baseUrl: 'http://localhost:1234/v1',
});

// Uses local tier defaults:
// - form: 'freeform'
// - maxLines: 30
// - unicode: true
```

## Prompt Patterns That Work Well

### High Confidence (routed automatically)
```
"concrete poetry about rain"
"word art: ELECTRIC"
"typographic art of a wave"
"experimental poetry: broken glass"
"letters cascading down like a waterfall"
```

### Moderate Confidence
```
"words arranged in a circle"
"text forming a heart shape"
"poetry that looks like a tree"
```

## Integration with run()

The generator is automatically registered, so prompts matching textgen patterns will route to it:

```typescript
import { run } from 'liminal';

// Automatically uses TextGenerativeGenerator
const result = await run("concrete poetry: falling leaves", {
  maxIterations: 1,  // Text doesn't need iteration
  output: './output/poem',
});
```

## Output Formats

The generator returns raw text, not code. Example outputs:

### Form: 'concrete'
```
  l
   e
    a
     v
      e
       s
falling
```

### Form: 'cascade'
```
time flows
time  flows
time   flows
time    flows
```

### Form: 'radial'
```
    S
   P A
  R  D  E
 A   R   K
  R  D  E
   P A
    S
```

## Performance Tips

1. **Use 1.2B models** - Text generation is fast even on tiny models
2. **Set maxLines** - Keep outputs manageable (20-30 lines optimal)
3. **Disable unicode** for ASCII-only outputs (faster validation)
4. **Single iteration** - Text doesn't benefit from RalphLoop refinement
