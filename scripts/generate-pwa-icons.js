const https = require('https');
const fs = require('fs');
const path = require('path');

const LOGO_URL = 'https://cdn.poehali.dev/files/8af0fa73-0b2f-4c2d-ad5e-cdc9818bab3c.jpg';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const BACKGROUND_COLOR = '#0a0a0a';

const SIZES = [
  { size: 192, maskable: false, name: 'icon-192.png' },
  { size: 192, maskable: true, name: 'icon-192-maskable.png' },
  { size: 512, maskable: false, name: 'icon-512.png' },
  { size: 512, maskable: true, name: 'icon-512-maskable.png' }
];

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

async function generateIcon(imageBuffer, size, maskable, outputPath) {
  const sharp = require('sharp');
  
  const iconSize = maskable ? Math.floor(size * 0.8) : size;
  const offset = maskable ? Math.floor(size * 0.1) : 0;
  
  await sharp(imageBuffer)
    .resize(iconSize, iconSize, {
      fit: 'cover',
      position: 'center'
    })
    .extend({
      top: offset,
      bottom: offset,
      left: offset,
      right: offset,
      background: BACKGROUND_COLOR
    })
    .png()
    .toFile(outputPath);
}

async function main() {
  console.log('🚀 STREAM BOOM - Генерация PWA иконок...\n');
  
  console.log('📥 Скачивание логотипа...');
  const imageBuffer = await downloadImage(LOGO_URL);
  console.log('✅ Логотип скачан\n');
  
  for (const config of SIZES) {
    console.log(`🎨 Генерация: ${config.name} (${config.size}x${config.size}, ${config.maskable ? 'maskable' : 'any'})`);
    const outputPath = path.join(PUBLIC_DIR, config.name);
    await generateIcon(imageBuffer, config.size, config.maskable, outputPath);
    console.log(`✅ Создан: ${config.name}\n`);
  }
  
  console.log('🎉 Все иконки успешно созданы в /public/!');
  console.log('📝 Обновите manifest.json для использования локальных иконок');
}

main().catch(console.error);
