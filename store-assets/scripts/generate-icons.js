// generate-icons.js
// Genera tutte le icone per Android e iOS da un'immagine sorgente 1024x1024
// Installa: npm install sharp
// Uso: node generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_ICON = process.argv[2] || 'icon-1024.png';

// Dimensioni Android
const ANDROID_ICONS = [
    { size: 48, folder: 'mipmap-mdpi', name: 'ic_launcher.png' },
    { size: 72, folder: 'mipmap-hdpi', name: 'ic_launcher.png' },
    { size: 96, folder: 'mipmap-xhdpi', name: 'ic_launcher.png' },
    { size: 144, folder: 'mipmap-xxhdpi', name: 'ic_launcher.png' },
    { size: 192, folder: 'mipmap-xxxhdpi', name: 'ic_launcher.png' },
    // Foreground per adaptive icons
    { size: 108, folder: 'mipmap-mdpi', name: 'ic_launcher_foreground.png' },
    { size: 162, folder: 'mipmap-hdpi', name: 'ic_launcher_foreground.png' },
    { size: 216, folder: 'mipmap-xhdpi', name: 'ic_launcher_foreground.png' },
    { size: 324, folder: 'mipmap-xxhdpi', name: 'ic_launcher_foreground.png' },
    { size: 432, folder: 'mipmap-xxxhdpi', name: 'ic_launcher_foreground.png' },
    // Play Store
    { size: 512, folder: 'playstore', name: 'icon-512.png' },
];

// Dimensioni iOS
const IOS_ICONS = [
    { size: 20, scale: 1, name: 'Icon-App-20x20@1x.png' },
    { size: 20, scale: 2, name: 'Icon-App-20x20@2x.png' },
    { size: 20, scale: 3, name: 'Icon-App-20x20@3x.png' },
    { size: 29, scale: 1, name: 'Icon-App-29x29@1x.png' },
    { size: 29, scale: 2, name: 'Icon-App-29x29@2x.png' },
    { size: 29, scale: 3, name: 'Icon-App-29x29@3x.png' },
    { size: 40, scale: 1, name: 'Icon-App-40x40@1x.png' },
    { size: 40, scale: 2, name: 'Icon-App-40x40@2x.png' },
    { size: 40, scale: 3, name: 'Icon-App-40x40@3x.png' },
    { size: 60, scale: 2, name: 'Icon-App-60x60@2x.png' },
    { size: 60, scale: 3, name: 'Icon-App-60x60@3x.png' },
    { size: 76, scale: 1, name: 'Icon-App-76x76@1x.png' },
    { size: 76, scale: 2, name: 'Icon-App-76x76@2x.png' },
    { size: 83.5, scale: 2, name: 'Icon-App-83.5x83.5@2x.png' },
    { size: 1024, scale: 1, name: 'Icon-App-1024x1024@1x.png' },
];

async function generateIcons() {
    console.log('🎨 Patente B Quiz - Icon Generator\n');

    // Verifica che l'icona sorgente esista
    if (!fs.existsSync(SOURCE_ICON)) {
        console.error(`❌ File non trovato: ${SOURCE_ICON}`);
        console.log('\nUso: node generate-icons.js [percorso-icona-1024.png]');
        process.exit(1);
    }

    const outputDir = './generated-icons';

    // Crea cartelle
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    if (!fs.existsSync(`${outputDir}/android`)) fs.mkdirSync(`${outputDir}/android`);
    if (!fs.existsSync(`${outputDir}/ios`)) fs.mkdirSync(`${outputDir}/ios`);

    // Genera icone Android
    console.log('📱 Generando icone Android...');
    for (const icon of ANDROID_ICONS) {
        const folderPath = `${outputDir}/android/${icon.folder}`;
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

        await sharp(SOURCE_ICON)
            .resize(icon.size, icon.size)
            .png()
            .toFile(`${folderPath}/${icon.name}`);

        console.log(`  ✓ ${icon.folder}/${icon.name} (${icon.size}x${icon.size})`);
    }

    // Genera icone iOS
    console.log('\n🍎 Generando icone iOS...');
    for (const icon of IOS_ICONS) {
        const actualSize = Math.round(icon.size * icon.scale);
        await sharp(SOURCE_ICON)
            .resize(actualSize, actualSize)
            .png()
            .toFile(`${outputDir}/ios/${icon.name}`);

        console.log(`  ✓ ${icon.name} (${actualSize}x${actualSize})`);
    }

    // Genera Contents.json per iOS
    const iosContents = {
        images: IOS_ICONS.map(icon => ({
            filename: icon.name,
            idiom: icon.size >= 76 ? 'ipad' : 'iphone',
            scale: `${icon.scale}x`,
            size: `${icon.size}x${icon.size}`
        })),
        info: { author: 'xcode', version: 1 }
    };

    fs.writeFileSync(
        `${outputDir}/ios/Contents.json`,
        JSON.stringify(iosContents, null, 2)
    );

    console.log('\n✅ Icone generate con successo in ./generated-icons/\n');
    console.log('📋 Prossimi passi:');
    console.log('   Android: Copia le cartelle mipmap-* in:');
    console.log('            patente_b_flutter/android/app/src/main/res/');
    console.log('   iOS:     Copia i file in:');
    console.log('            patente_b_flutter/ios/Runner/Assets.xcassets/AppIcon.appiconset/');
}

generateIcons().catch(console.error);
