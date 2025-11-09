# 🚀 Deploy Patente B 2023 su Vercel

Guida completa per il deploy in produzione dell'app PWA.

## 📋 **Prerequisiti**

1. **Account Vercel**: https://vercel.com/signup (gratuito)
2. **Repository GitHub**: Già configurato (https://github.com/kmrnnwr11-jpg/PATENTE-B-2.0)
3. **API Keys**:
   - Firebase (già configurato)
   - DeepL API (per traduzioni)
   - ElevenLabs API (per audio, opzionale)

---

## 🔧 **Step 1: Collegare GitHub a Vercel**

### Via Web (Più Semplice):

1. **Vai su Vercel**: https://vercel.com
2. **Login** con GitHub
3. **New Project** → **Import Git Repository**
4. **Seleziona**: `PATENTE-B-2.0`
5. **Configure Project**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Via CLI (Alternativa):

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/kmrnnwr/PATENTE-B-2.0
vercel
```

---

## 🔐 **Step 2: Configurare Variabili Ambiente**

Nel dashboard Vercel (Settings → Environment Variables), aggiungi:

### **Firebase (Obbligatorio)**
```
VITE_FIREBASE_API_KEY=AIzaSyC2KER9GhTbMoN8XHXVIiErKhkaXct9nbw
VITE_FIREBASE_AUTH_DOMAIN=patente-b-2025.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=patente-b-2025
VITE_FIREBASE_STORAGE_BUCKET=patente-b-2025.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=816270740093
VITE_FIREBASE_APP_ID=1:816270740093:web:90a21eb0c7054e0824ff14
```

### **DeepL (Obbligatorio per Traduzioni)**
```
VITE_DEEPL_API_KEY=tua_deepl_key_qua
```

### **ElevenLabs (Opzionale per Audio)**
```
VITE_ELEVENLABS_API_KEY=tua_elevenlabs_key_qua
VITE_ELEVENLABS_VOICE_UR=voice_id_urdu
VITE_ELEVENLABS_VOICE_HI=voice_id_hindi
VITE_ELEVENLABS_VOICE_PA=voice_id_punjabi
VITE_ELEVENLABS_VOICE_EN=voice_id_english
```

**Importante**: Seleziona **Production**, **Preview**, e **Development** per ogni variabile.

---

## 🌐 **Step 3: Deploy**

### Deploy Automatico (Consigliato):

Ogni `git push` su `main` triggera deploy automatico:

```bash
git add -A
git commit -m "feat: Deploy produzione"
git push origin main
```

Vercel:
- **Builda** automaticamente
- **Deploya** su URL temporaneo (es. `patente-b-xyz.vercel.app`)
- **Promuove** a produzione se tutto OK

### Deploy Manuale:

```bash
vercel --prod
```

---

## 📱 **Step 4: Configurare PWA**

### Vercel Headers (Già in `vercel.json`):

- ✅ Cache assets (1 anno)
- ✅ Security headers (XSS, CORS)
- ✅ Service Worker support

### Manifest (Già in `public/manifest.json`):

- ✅ Icone (192x192, 512x512)
- ✅ Theme color (#3b82f6)
- ✅ Display: standalone
- ✅ Start URL: /

### Test PWA:

1. Apri app su mobile: `https://tuo-dominio.vercel.app`
2. Chrome: Menu → "Installa app"
3. Safari: Condividi → "Aggiungi a Schermo Home"

---

## 🔥 **Step 5: Prewarm Cache (Post-Deploy)**

Dopo il primo deploy, esegui prewarm per popolare cache:

```bash
# Locale (con .env.local)
npm run prewarm

# Oppure via script remoto (Vercel Serverless Function)
# (Da implementare se necessario)
```

Questo genera traduzioni+audio per tutte le 5127 parole uniche (€0 costi, dentro free tier).

---

## 📊 **Monitoraggio**

### Vercel Dashboard:

- **Analytics**: Visite, performance
- **Logs**: Errori runtime
- **Deployments**: Storia deploy

### Firebase Console:

- **Firestore**: Cache traduzioni
- **Storage**: Audio files
- **Auth**: Utenti (anonymous)

---

## 🎯 **URL Produzione**

Dopo deploy, l'app sarà disponibile su:

```
https://patente-b-2023.vercel.app
```

(O dominio custom se configurato)

---

## 🐛 **Troubleshooting**

### Build Fallisce:

```bash
# Testa build locale
npm run build

# Controlla errori TypeScript
npm run type-check
```

### Variabili Ambiente Non Funzionano:

- Verifica prefisso `VITE_` (obbligatorio per Vite)
- Redeploy dopo modifica variabili
- Controlla Vercel Logs per errori

### PWA Non Installabile:

- Verifica HTTPS (Vercel lo fornisce automaticamente)
- Controlla `manifest.json` e icone in `public/`
- Service Worker deve essere registrato (già in `main.tsx`)

---

## 🚀 **Deploy Completato!**

✅ App live su Vercel
✅ PWA installabile
✅ Traduzioni attive (DeepL + cache)
✅ Audio multilingua (ElevenLabs)
✅ Firebase integrato
✅ Zero costi runtime (cache + free tier)

**Testa su mobile**: Apri URL Vercel → Installa app → Usa offline!

---

## 📞 **Supporto**

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- DeepL API: https://www.deepl.com/docs-api
- ElevenLabs API: https://docs.elevenlabs.io

