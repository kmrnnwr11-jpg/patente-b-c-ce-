# 📱 Store Assets Generator
## Patente B Quiz - Play Store & App Store

Questa cartella contiene script per generare automaticamente gli assets necessari per pubblicare l'app su Play Store e App Store.

---

## 🚀 Quick Start

```bash
# 1. Installa dipendenze
cd store-assets
npm install

# 2. Genera le icone (richiede icon-1024.png)
node scripts/generate-icons.js ../path/to/icon-1024.png

# 3. Genera Feature Graphic
node scripts/generate-feature-graphic.js

# 4. Genera screenshot promozionali
node scripts/generate-screenshots.js
```

---

## 📋 Checklist Assets

### Play Store (Android)

| Asset | Dimensioni | Obbligatorio | File |
|-------|-----------|--------------|------|
| Icona app | 512x512 | ✅ | `icon-512.png` |
| Feature Graphic | 1024x500 | ✅ | `feature-graphic.png` |
| Screenshot telefono | 1080x1920 (min 2) | ✅ | `screenshot-1.png` ... |
| Screenshot tablet 7" | 1200x1920 | ❌ | - |
| Screenshot tablet 10" | 1800x2560 | ❌ | - |
| Video promo | YouTube link | ❌ | - |

### App Store (iOS)

| Asset | Dimensioni | Obbligatorio | File |
|-------|-----------|--------------|------|
| Icona app | 1024x1024 | ✅ | `Icon-App-1024x1024@1x.png` |
| Screenshot 6.5" | 1284x2778 (min 2) | ✅ | `screenshot-6.5-*.png` |
| Screenshot 5.5" | 1242x2208 (min 2) | ✅ | `screenshot-5.5-*.png` |
| Screenshot iPad 12.9" | 2048x2732 | ❌ | - |
| App Preview video | - | ❌ | - |

---

## 🎨 Generatore Icone

Lo script `generate-icons.js` genera tutte le dimensioni necessarie da un'icona sorgente 1024x1024.

### Uso

```bash
node scripts/generate-icons.js path/to/icon-1024.png
```

### Output

```
generated-icons/
├── android/
│   ├── mipmap-mdpi/
│   │   └── ic_launcher.png (48x48)
│   ├── mipmap-hdpi/
│   │   └── ic_launcher.png (72x72)
│   ├── mipmap-xhdpi/
│   │   └── ic_launcher.png (96x96)
│   ├── mipmap-xxhdpi/
│   │   └── ic_launcher.png (144x144)
│   ├── mipmap-xxxhdpi/
│   │   └── ic_launcher.png (192x192)
│   └── playstore/
│       └── icon-512.png
│
└── ios/
    ├── Icon-App-20x20@1x.png
    ├── Icon-App-20x20@2x.png
    ├── Icon-App-20x20@3x.png
    ├── ... (tutte le dimensioni)
    ├── Icon-App-1024x1024@1x.png
    └── Contents.json
```

### Dove Copiare

- **Android**: `patente_b_flutter/android/app/src/main/res/`
- **iOS**: `patente_b_flutter/ios/Runner/Assets.xcassets/AppIcon.appiconset/`

---

## 📸 Generatore Screenshot

Lo script `generate-screenshots.js` crea screenshot promozionali con cornice device e testo.

### Preparazione

1. Cattura screenshot raw dall'emulatore/device
2. Salva in `store-assets/screenshots-raw/`
3. Nomina: `screenshot-1.png`, `screenshot-2.png`, ecc.

### Uso

```bash
node scripts/generate-screenshots.js
```

### Output

```
generated-screenshots/
├── android/
│   ├── screenshot-1.png (1080x1920)
│   ├── screenshot-2.png
│   ├── screenshot-3.png
│   ├── screenshot-4.png
│   └── screenshot-5.png
│
└── ios/
    ├── screenshot-6.5-1.png (1284x2778)
    ├── screenshot-6.5-2.png
    ├── screenshot-5.5-1.png (1242x2208)
    └── screenshot-5.5-2.png
```

---

## 🖼️ Feature Graphic

Lo script `generate-feature-graphic.js` crea la Feature Graphic per Play Store.

```bash
node scripts/generate-feature-graphic.js
```

Output: `generated-screenshots/android/feature-graphic.png` (1024x500)

---

## 🛠️ Build Comandi

### Android (Play Store)

```bash
# Genera AAB per Play Store
cd patente_b_flutter
flutter build appbundle --release

# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS (App Store)

```bash
# Genera build iOS
cd patente_b_flutter
flutter build ios --release

# Apri Xcode e archivia
open ios/Runner.xcworkspace
# Product → Archive → Distribute App
```

---

## 📝 Store Listing Template

### Titolo
`Patente B Quiz - Esame Ministeriale`

### Descrizione Breve
`Quiz patente B aggiornati 2024. Preparati all'esame con migliaia di domande!`

### Descrizione Completa
```
🚗 PATENTE B QUIZ - La tua patente a portata di tap!

Preparati all'esame di teoria per la patente B con la nostra app completa:

✅ QUIZ AGGIORNATI 2024
- Tutte le domande del programma ministeriale
- Aggiornamenti costanti

📚 TEORIA COMPLETA
- 30 lezioni dettagliate
- Segnali stradali illustrati
- Spiegazioni in italiano e multilingua

🎯 SIMULAZIONI ESAME
- Esattamente come il test reale
- 40 domande, 30 minuti
- Valutazione immediata

📊 STATISTICHE
- Monitora i tuoi progressi
- Identifica i punti deboli
- Migliora costantemente

🌍 MULTILINGUA
- Italiano, Inglese, Urdu, Punjabi
- Perfetto per stranieri in Italia

Scarica ora e inizia a studiare per la tua patente B!
```

### Keywords
`patente b, quiz patente, esame teoria, patente italiana, quiz ministeriali, patente stranieri`

---

## 📞 Supporto

Per problemi con gli script, contatta: kmrnnwr11@gmail.com
