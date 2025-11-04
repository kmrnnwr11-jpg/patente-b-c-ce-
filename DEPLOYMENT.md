# 🚀 Guida al Deployment - Patente B 2025

## 📋 Prerequisiti

- Node.js 18+ installato
- npm o yarn
- Account Firebase (per autenticazione e database)
- Account Vercel/Netlify (per hosting) - OPZIONALE

---

## 🔧 Setup Iniziale

### 1. Installazione Dipendenze

```bash
npm install
```

### 2. Configurazione Variabili d'Ambiente

Crea un file `.env` nella root del progetto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Analytics
VITE_GA_MEASUREMENT_ID=your_ga_id

# Optional: API Keys
VITE_CLAUDE_API_KEY=your_claude_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

---

## 🏗️ Build per Produzione

### Build Standard

```bash
npm run build
```

Questo comando:
- Compila TypeScript
- Ottimizza bundle con Vite
- Rimuove console.log
- Genera chunks ottimizzati
- Crea Service Worker per PWA

### Preview Build Locale

```bash
npm run preview
```

Testa la build di produzione localmente su `http://localhost:4173`

---

## 📦 Deploy su Vercel

### Deploy Automatico (Consigliato)

1. **Connetti Repository**
   ```bash
   # Installa Vercel CLI
   npm i -g vercel
   
   # Login
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configura Variabili d'Ambiente**
   - Vai su Vercel Dashboard
   - Settings → Environment Variables
   - Aggiungi tutte le variabili dal file `.env`

3. **Deploy Automatico**
   - Ogni push su `main` triggera un deploy automatico
   - Preview deployments per ogni PR

### Configurazione `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## 🌐 Deploy su Netlify

### Deploy con Netlify CLI

```bash
# Installa Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

### Configurazione `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🔥 Setup Firebase

### 1. Crea Progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea nuovo progetto
3. Abilita Authentication (Email/Password + Google)
4. Crea Firestore Database

### 2. Configura Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leaderboard (read-only per tutti)
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Quiz attempts
    match /quiz_attempts/{attemptId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

### 3. Configura Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /quiz-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📊 Analytics Setup

### Google Analytics 4

1. Crea proprietà GA4
2. Aggiungi Measurement ID a `.env`
3. Il tracking è già configurato nel codice

### Plausible Analytics (Alternativa Privacy-First)

```html
<!-- Aggiungi in index.html -->
<script defer data-domain="tuodominio.com" src="https://plausible.io/js/script.js"></script>
```

---

## ✅ Checklist Pre-Deploy

- [ ] Tutte le variabili d'ambiente configurate
- [ ] Firebase setup completato
- [ ] Build locale testata (`npm run build && npm run preview`)
- [ ] Service Worker funzionante
- [ ] PWA installabile
- [ ] Responsive design verificato
- [ ] Performance Lighthouse > 90
- [ ] SEO meta tags configurati
- [ ] Error Boundary testato
- [ ] Analytics configurato

---

## 🔍 Monitoring Post-Deploy

### Performance Monitoring

```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=https://tuodominio.com
```

### Error Tracking

Integra Sentry per tracking errori:

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

---

## 🐛 Troubleshooting

### Build Fallisce

```bash
# Pulisci cache
rm -rf node_modules dist .vite
npm install
npm run build
```

### Service Worker Non Funziona

1. Verifica che HTTPS sia abilitato
2. Controlla Console Browser per errori
3. Forza refresh: Ctrl+Shift+R

### Firebase Non Connette

1. Verifica variabili d'ambiente
2. Controlla Firebase Console per errori
3. Verifica Firestore Rules

---

## 📈 Ottimizzazioni Post-Deploy

### CDN per Immagini

Usa Cloudinary o ImageKit per ottimizzare immagini:

```typescript
const imageUrl = `https://res.cloudinary.com/your-cloud/image/upload/w_800,q_auto,f_auto/quiz-images/${imageName}`;
```

### Database Indexing

Crea indici Firestore per query frequenti:

```bash
# Esempio: index su leaderboard
Collection: leaderboard
Fields: score (Descending), timestamp (Descending)
```

---

## 🎉 Deploy Completato!

L'app è ora live e pronta per gli utenti!

### Prossimi Passi

1. Monitora analytics
2. Raccogli feedback utenti
3. Itera e migliora
4. Aggiungi nuove features

---

## 📞 Supporto

Per problemi o domande:
- GitHub Issues
- Email: support@patenteB2025.com
- Discord: [Link Community]

---

**Buon Deploy! 🚀**

