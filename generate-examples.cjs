const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/Users/simongonzalezdecruz/workspaces/liminal/landing-assets';

const examples = [
  { prompt: 'organic patterns with Perlin noise and soft colors', name: 'p5-3-organic' },
  { prompt: 'black and white minimal circles', name: 'p5-4-minimal' },
  { prompt: 'glitch art with artifacts and distortion', name: 'p5-5-glitch' },
];

async function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: '/Users/simongonzalezdecruz/workspaces/liminal' }, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

async function generateAndCapture(example) {
  console.log(`Generating: ${example.prompt}`);

  // Generate
  await runCommand(`node bin/liminal generate "${example.prompt}" --max-iterations 1 --output ${OUTPUT_DIR}`);

  // Capture screenshot
  const htmlPath = path.join(OUTPUT_DIR, 'cli-project-final.html');
  const pngPath = path.join(OUTPUT_DIR, `${example.name}.png`);
  const capturePath = path.join(__dirname, 'capture.cjs');

  await runCommand(`node ${capturePath} ${htmlPath} ${pngPath}`);

  // Rename the files for reference
  const jsPath = path.join(OUTPUT_DIR, 'cli-project-final.js');
  const savedJs = path.join(OUTPUT_DIR, `${example.name}.js`);
  fs.renameSync(jsPath, savedJs);

  const savedHtml = path.join(OUTPUT_DIR, `${example.name}.html`);
  fs.renameSync(htmlPath, savedHtml);

  console.log(`✅ Complete: ${example.name}`);
}

async function main() {
  for (const example of examples) {
    try {
      await generateAndCapture(example);
    } catch (error) {
      console.error(`❌ Error with ${example.name}:`, error.message);
    }
  }
  console.log('All examples generated!');
}

main().catch(console.error);
