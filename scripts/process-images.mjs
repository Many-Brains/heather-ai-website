import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SHOTS = [
  ['docs/images/ios-inbox/qa/qa-5.png', 'chat-plan'],
  ['docs/images/ios-inbox/qa/qa-3.png', 'today'],
  ['docs/images/ios-inbox/qa/qa-2.png', 'daily-plan'],
  ['docs/images/ios-inbox/qa/qa-1.png', 'weight-chart'],
  ['docs/images/ios-inbox/ios-5.png', 'photo-log'],
];
mkdirSync('public/images/app/ios', { recursive: true });
mkdirSync('public/images/books', { recursive: true });

for (const [src, name] of SHOTS) {
  const img = sharp(src);
  const { width, height } = await img.metadata();
  // Crop the iOS status bar (time/battery) — top ~190px at 3x scale.
  await img
    .extract({ left: 0, top: 190, width, height: height - 190 })
    .resize({ width: 828 })
    .webp({ quality: 82 })
    .toFile(`public/images/app/ios/${name}.webp`);
  console.log(`✓ ${name}.webp`);
}

const BOOKS = [
  ['wsd.jpeg', 'wall-street-diet'],
  ['bread.jpeg', 'bread-is-the-devil'],
];
for (const [src, name] of BOOKS) {
  await sharp(`docs/images/books-src/${src}`)
    .resize({ width: 600 })
    .webp({ quality: 85 })
    .toFile(`public/images/books/${name}.webp`);
  console.log(`✓ ${name}.webp`);
}
