// generate-feature-graphic.js
// Genera Feature Graphic 1024x500 per Play Store
// Uso: node generate-feature-graphic.js

const sharp = require('sharp');
const fs = require('fs');

async function generateFeatureGraphic() {
    console.log('🎨 Generando Feature Graphic per Play Store...\n');

    const width = 1024;
    const height = 500;

    // SVG per Feature Graphic
    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a237e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#4a148c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7b1fa2;stop-opacity:1" />
        </linearGradient>
        
        <!-- Pattern decorativo -->
        <pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/>
        </pattern>
      </defs>
      
      <!-- Sfondo gradient -->
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#pattern)"/>
      
      <!-- Icona app (simbolo auto) -->
      <rect x="60" y="160" width="100" height="100" rx="25" fill="white"/>
      <text x="110" y="230" text-anchor="middle" font-size="60">🚗</text>
      
      <!-- Titolo -->
      <text x="200" y="190" font-family="Arial, sans-serif" font-size="56" font-weight="bold" fill="white">
        Patente B Quiz
      </text>
      
      <!-- Sottotitolo -->
      <text x="200" y="250" font-family="Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.85)">
        La tua patente a portata di tap!
      </text>
      
      <!-- Badge -->
      <rect x="200" y="280" width="100" height="35" rx="17" fill="rgba(255,255,255,0.2)"/>
      <text x="250" y="305" text-anchor="middle" font-family="Arial" font-size="16" fill="white">🇮🇹 Italiano</text>
      
      <rect x="320" y="280" width="90" height="35" rx="17" fill="rgba(255,255,255,0.2)"/>
      <text x="365" y="305" text-anchor="middle" font-family="Arial" font-size="16" fill="white">📱 Offline</text>
      
      <rect x="430" y="280" width="80" height="35" rx="17" fill="rgba(255,255,255,0.2)"/>
      <text x="470" y="305" text-anchor="middle" font-family="Arial" font-size="16" fill="white">✨ 2024</text>
      
      <!-- Mockup telefono (lato destro) -->
      <g transform="translate(700, 50) rotate(5)">
        <rect x="0" y="0" width="180" height="360" rx="25" fill="#1a1a1a"/>
        <rect x="10" y="20" width="160" height="320" rx="18" fill="#ffffff"/>
        
        <!-- Contenuto mockup -->
        <rect x="10" y="20" width="160" height="50" fill="#667eea"/>
        <text x="90" y="52" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="white">Quiz Patente</text>
        
        <!-- Pulsanti finti -->
        <rect x="25" y="90" width="130" height="40" rx="10" fill="#f0f0f0"/>
        <rect x="25" y="140" width="130" height="40" rx="10" fill="#f0f0f0"/>
        <rect x="25" y="190" width="130" height="40" rx="10" fill="#667eea"/>
        <text x="90" y="217" text-anchor="middle" font-family="Arial" font-size="12" fill="white">INIZIA QUIZ</text>
      </g>
      
      <!-- Stelle review -->
      <text x="200" y="380" font-family="Arial" font-size="24" fill="#ffc107">★★★★★</text>
      <text x="340" y="380" font-family="Arial" font-size="16" fill="rgba(255,255,255,0.7)">4.8 • 10K+ download</text>
    </svg>
  `;

    const outputDir = './generated-screenshots';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    if (!fs.existsSync(`${outputDir}/android`)) fs.mkdirSync(`${outputDir}/android`);

    await sharp(Buffer.from(svg))
        .png()
        .toFile(`${outputDir}/android/feature-graphic.png`);

    console.log('✅ Feature Graphic generato: generated-screenshots/android/feature-graphic.png');
    console.log(`   Dimensioni: ${width}x${height}px`);
}

generateFeatureGraphic().catch(console.error);
