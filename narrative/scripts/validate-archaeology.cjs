#!/usr/bin/env node
/**
 * Archaeology HTML Validator
 * 
 * Validates narrative/archaeology.html for common defects before committing.
 * Run: node narrative/scripts/validate-archaeology.js
 * 
 * Exit codes:
 *   0 = All validations passed
 *   1 = One or more validations failed
 */

const fs = require('fs');
const path = require('path');

const ARCHAEOLOGY_PATH = path.join(__dirname, '..', 'archaeology.html');
const errors = [];
const warnings = [];

console.log('🔍 Validating archaeology.html...\n');

// Check file exists
if (!fs.existsSync(ARCHAEOLOGY_PATH)) {
  console.error(`❌ File not found: ${ARCHAEOLOGY_PATH}`);
  process.exit(1);
}

const file = fs.readFileSync(ARCHAEOLOGY_PATH, 'utf8');

// ============================================================================
// CHECK 1: No [object Object] serialization bugs
// ============================================================================
if (file.includes('[object Object]')) {
  errors.push('Found "[object Object]" - data serialization bug in agent cards');
} else {
  console.log('✅ No [object Object] bugs found');
}

// ============================================================================
// CHECK 2: Era names not truncated (only in chart rendering, not JSON data)
// ============================================================================
const truncatedEras = [
  'he Great Consolidation',
  'he Conversational Turn', 
  'he Quiet',
  'he Pruning',
  'he Seed',
  'he Explosion'
];

let foundTruncated = false;
// Check only outside of JSON string values (chart text content only)
const fileWithoutJsonStrings = file.replace(/"[^"]*":\s*"[^"]*"/g, '');
truncatedEras.forEach(era => {
  if (fileWithoutJsonStrings.includes(era)) {
    errors.push(`Found truncated era name: "${era}" (missing first letter)`);
    foundTruncated = true;
  }
});

if (!foundTruncated) {
  console.log('✅ No truncated era names found');
}

// ============================================================================
// CHECK 3: All 13 era colors defined
// ============================================================================
let missingEraColors = [];
for (let i = 1; i <= 13; i++) {
  if (!file.includes(`--era${i}:`)) {
    missingEraColors.push(i);
  }
}

if (missingEraColors.length > 0) {
  errors.push(`Missing era color variables: ${missingEraColors.map(i => `--era${i}`).join(', ')}`);
} else {
  console.log('✅ All 13 era colors defined');
}

// ============================================================================
// CHECK 4: JSON data validity
// ============================================================================
const jsonMatch = file.match(/window\.LIMINAL_DATA\s*=\s*(\{[\s\S]*?\});/);
if (jsonMatch) {
  try {
    const data = JSON.parse(jsonMatch[1]);
    
    // Check required fields
    const required = ['commits_per_day', 'loc_growth', 'eras', 'agent_attribution'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      errors.push(`Missing required data fields: ${missing.join(', ')}`);
    } else {
      console.log('✅ JSON data structure valid');
    }
    
    // Check era count
    if (data.eras && data.eras.length !== 13) {
      errors.push(`Expected 13 eras, found ${data.eras.length}`);
    }
    
  } catch (e) {
    errors.push(`Invalid JSON in LIMINAL_DATA: ${e.message}`);
  }
} else {
  warnings.push('Could not find LIMINAL_DATA object for validation');
}

// ============================================================================
// CHECK 5: CSS variables present
// ============================================================================
const requiredVars = ['--bg', '--surface', '--text', '--text2', '--kai', '--cursor', '--claude'];
const missingVars = requiredVars.filter(v => !file.includes(`${v}:`));

if (missingVars.length > 0) {
  errors.push(`Missing CSS variables: ${missingVars.join(', ')}`);
} else {
  console.log('✅ All required CSS variables present');
}

// ============================================================================
// CHECK 6: Chart container IDs present
// ============================================================================
const requiredCharts = [
  'chart-commits',
  'chart-loc-growth', 
  'chart-era-map',
  'chart-hourly-polar',
  'chart-heatmap',
  'chart-agent-econ'
];

const missingCharts = requiredCharts.filter(id => !file.includes(`id="${id}"`));

if (missingCharts.length > 0) {
  errors.push(`Missing chart containers: ${missingCharts.join(', ')}`);
} else {
  console.log('✅ All required chart containers present');
}

// ============================================================================
// CHECK 7: No placeholder text
// ============================================================================
const placeholders = ['TODO', 'FIXME', 'XXX', 'HACK'];
const foundPlaceholders = placeholders.filter(p => 
  file.toLowerCase().includes(p.toLowerCase())
);

if (foundPlaceholders.length > 0) {
  warnings.push(`Found placeholder markers: ${foundPlaceholders.join(', ')}`);
}

// ============================================================================
// REPORT
// ============================================================================
console.log('\n' + '='.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ ALL VALIDATIONS PASSED');
  console.log('='.repeat(60));
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERROR(S) FOUND:`);
    errors.forEach(e => console.log(`   • ${e}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} WARNING(S):`);
    warnings.forEach(w => console.log(`   • ${w}`));
  }
  
  console.log('='.repeat(60));
  console.log('\n📖 See narrative/ARCHAEOLOGY_STYLE_GUIDE.md for fix instructions\n');
  process.exit(1);
}
