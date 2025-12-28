// generate-screenshots.js
// Crea immagini promozionali con cornice device dagli screenshot dell'app
// Uso: node generate-screenshots.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configurazione screenshot Play Store
const PLAY_STORE_SIZES = {
    phone: { width: 1080, height: 1920 }, // 16:9 o 9:16
    tablet7: { width: 1200, height: 1920 },
    tablet10: { width: 1800, height: 2560 },
};

// Configurazione screenshot App Store
const APP_STORE_SIZES = {
    iphone65: { width: 1284, height: 2778, name: '6.5 inch' },
    iphone55: { width: 1242, height: 2208, name: '5.5 inch' },
    ipad129: { width: 2048, height: 2732, name: '12.9 inch iPad' },
};

// Testi promozionali per ogni screenshot
const PROMO_TEXTS = [
    {
        title: 'Quiz Patente B',
        subtitle: 'Preparati all\'esame con facilità',
        gradient: ['#667eea', '#764ba2'],
    },
    {
        title: 'Migliaia di Quiz',
        subtitle: 'Tutti gli argomenti del programma',
        gradient: ['#11998e', '#38ef7d'],
    },
    {
        title: 'Simulazioni Esame',
        subtitle: 'Come il vero test ministeriale',
        gradient: ['#f093fb', '#f5576c'],
    },
    {
        title: 'Statistiche Dettagliate',
        subtitle: 'Monitora i tuoi progressi',
        gradient: ['#4facfe', '#00f2fe'],
    },
    {
        title: 'Multilingua',
        subtitle: 'Disponibile in più lingue',
        gradient: ['#fa709a', '#fee140'],
    },
];

async function createPromoImage(screenshotPath, outputPath, config, size) {
    const { title, subtitle, gradient } = config;

    // Crea SVG per lo sfondo gradient e il testo
    const svgBackground = `
    <svg width="${size.width}" height="${size.height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      
      <!-- Titolo -->
      <text x="${size.width / 2}" y="180" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="72" 
        font-weight="bold" 
        fill="white">${title}</text>
      
      <!-- Sottotitolo -->
      <text x="${size.width / 2}" y="260" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="36" 
        fill="rgba(255,255,255,0.8)">${subtitle}</text>
    </svg>
  `;

    // Crea immagine di sfondo
    const background = await sharp(Buffer.from(svgBackground))
        .png()
        .toBuffer();

    // Se c'è uno screenshot, composita
    if (fs.existsSync(screenshotPath)) {
        const phoneWidth = Math.round(size.width * 0.6);
        const phoneHeight = Math.round(phoneWidth * 2);

        const screenshot = await sharp(screenshotPath)
            .resize(phoneWidth - 30, phoneHeight - 60)
            .png()
            .toBuffer();

        // Cornice telefono
        const phoneSvg = `
      <svg width="${phoneWidth}" height="${phoneHeight}">
        <rect x="0" y="0" width="${phoneWidth}" height="${phoneHeight}" 
          rx="40" ry="40" fill="#1a1a1a"/>
        <rect x="15" y="30" width="${phoneWidth - 30}" height="${phoneHeight - 60}" 
          rx="25" ry="25" fill="white"/>
      </svg>
    `;

        const phoneFrame = await sharp(Buffer.from(phoneSvg))
            .png()
            .toBuffer();

        // Composita tutto
        await sharp(background)
            .composite([
                {
                    input: phoneFrame,
                    top: Math.round(size.height * 0.35),
                    left: Math.round((size.width - phoneWidth) / 2),
                },
                {
                    input: screenshot,
                    top: Math.round(size.height * 0.35) + 30,
                    left: Math.round((size.width - phoneWidth) / 2) + 15,
                },
            ])
            .png()
            .toFile(outputPath);
    } else {
        // Solo sfondo con testo
        await sharp(background).toFile(outputPath);
    }

    console.log(`  ✓ ${path.basename(outputPath)}`);
}

async function generateScreenshots() {
    console.log('📸 Patente B Quiz - Screenshot Generator\n');

    const inputDir = './screenshots-raw';
    const outputDir = './generated-screenshots';

    // Crea cartelle
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    if (!fs.existsSync(`${outputDir}/android`)) fs.mkdirSync(`${outputDir}/android`);
    if (!fs.existsSync(`${outputDir}/ios`)) fs.mkdirSync(`${outputDir}/ios`);

    // Genera screenshot Android
    console.log('📱 Generando screenshot Android (Play Store)...');
    for (let i = 0; i < PROMO_TEXTS.length; i++) {
        const rawScreenshot = `${inputDir}/screenshot-${i + 1}.png`;
        const output = `${outputDir}/android/screenshot-${i + 1}.png`;
        await createPromoImage(rawScreenshot, output, PROMO_TEXTS[i], PLAY_STORE_SIZES.phone);
    }

    // Genera screenshot iOS
    console.log('\n🍎 Generando screenshot iOS (App Store)...');
    for (let i = 0; i < PROMO_TEXTS.length; i++) {
        const rawScreenshot = `${inputDir}/screenshot-${i + 1}.png`;

        // iPhone 6.5"
        await createPromoImage(
            rawScreenshot,
            `${outputDir}/ios/screenshot-6.5-${i + 1}.png`,
            PROMO_TEXTS[i],
            APP_STORE_SIZES.iphone65
        );

        // iPhone 5.5"
        await createPromoImage(
            rawScreenshot,
            `${outputDir}/ios/screenshot-5.5-${i + 1}.png`,
            PROMO_TEXTS[i],
            APP_STORE_SIZES.iphone55
        );
    }

    console.log('\n✅ Screenshot generati in ./generated-screenshots/\n');
    console.log('💡 Suggerimento: Metti i tuoi screenshot raw in ./screenshots-raw/');
    console.log('   Nomina i file: screenshot-1.png, screenshot-2.png, ecc.');
}

generateScreenshots().catch(console.error);
