// Crop the photo strip into 3 frame images for the anniversary page.
//
// Usage:  node scripts/crop-strip.mjs
//
// Reads /photostrip.jpg (the source photo of the strip held in hand),
// crops the strip out of it, then crops 3 individual photo frames.
// Writes anniversary/strip.jpg and anniversary/frame{1,2,3}.jpg.
//
// One-time setup:  npm install --no-save sharp
//
// All crop coordinates are in pixels; tweak in one place.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = resolve(root, 'photostrip.jpg');
const OUT = resolve(root, 'anniversary');

const STRIP = { left: 350, top: 185, width: 410, height: 1235 };
const FRAMES = [
  { x: 55, y: 28,  w: 305, h: 258 },
  { x: 55, y: 350, w: 305, h: 262 },
  { x: 55, y: 638, w: 305, h: 268 },
];

const stripBuf = await sharp(SRC).extract(STRIP).toBuffer();
await sharp(stripBuf).jpeg({ quality: 90 }).toFile(`${OUT}/strip.jpg`);
for (let i = 0; i < FRAMES.length; i++) {
  const f = FRAMES[i];
  await sharp(stripBuf)
    .extract({ left: f.x, top: f.y, width: f.w, height: f.h })
    .jpeg({ quality: 92 })
    .toFile(`${OUT}/frame${i + 1}.jpg`);
}
console.log('Cropped strip + 3 frames into anniversary/');
