#!/bin/bash
cd landing-assets

echo "=== Rendering Remotion Video ==="

# Bundle and render
npx remotion render remotion-entry.tsx TitleSequence dogfood-remotion-final.mp4 \
  --log=error \
  --codec=h264

echo "=== Done ==="
ls -lh dogfood-remotion-final.mp4
