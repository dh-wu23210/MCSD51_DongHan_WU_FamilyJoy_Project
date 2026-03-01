#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function loadSharp() {
  try {
    return require('sharp');
  } catch (error) {
    const fallbackPath = path.join(__dirname, '..', 'src', 'node_modules', 'sharp');
    return require(fallbackPath);
  }
}

function printUsage() {
  console.log('Usage:');
  console.log('  node tools/png-trim.js <input.png> [output.png]');
  console.log('  node tools/png-trim.js --inplace <input.png>');
}

function isPng(filePath) {
  return path.extname(filePath).toLowerCase() === '.png';
}

async function main() {
  const sharp = loadSharp();
  const args = process.argv.slice(2);

  if (!args.length || args.includes('-h') || args.includes('--help')) {
    printUsage();
    process.exit(0);
  }

  const inplace = args[0] === '--inplace';
  const inputArg = inplace ? args[1] : args[0];
  const outputArg = inplace ? args[1] : args[1];

  if (!inputArg) {
    printUsage();
    throw new Error('Missing input file.');
  }

  const inputPath = path.resolve(inputArg);
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Input not found: ${inputPath}`);
  }
  if (!isPng(inputPath)) {
    throw new Error('Only .png files are supported.');
  }

  let outputPath;
  if (inplace) {
    outputPath = inputPath;
  } else if (outputArg) {
    outputPath = path.resolve(outputArg);
  } else {
    const parsed = path.parse(inputPath);
    outputPath = path.join(parsed.dir, `${parsed.name}.trim${parsed.ext}`);
  }

  if (!isPng(outputPath)) {
    throw new Error('Output file must be .png.');
  }

  const buffer = await sharp(inputPath).trim().png().toBuffer();
  await fs.promises.writeFile(outputPath, buffer);
  console.log(`Trimmed PNG saved: ${outputPath}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});

