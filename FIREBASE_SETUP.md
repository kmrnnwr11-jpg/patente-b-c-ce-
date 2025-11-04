# 🔥 GUIDA SETUP FIREBASE

## 📋 COSA ABBIAMO CREATO

✅ **Firebase Configuration** (`src/lib/firebase.ts`)
✅ **AuthContext** (`src/contexts/AuthContext.tsx`)
✅ **LoginForm** (`src/components/auth/LoginForm.tsx`)
✅ **RegisterForm** (`src/components/auth/RegisterForm.tsx`)
✅ **LoginPage** (`src/pages/auth/LoginPage.tsx`)
✅ **RegisterPage** (`src/pages/auth/RegisterPage.tsx`)

---

## 🚀 STEP 1: CREARE PROGETTO FIREBASE

1. Vai su https://console.firebase.google.com/
2. Clicca su "Aggiungi progetto"
3. Nome progetto: **patente-b-2025**
4. Disabilita Google Analytics (opzionale)
5. Clicca "Crea progetto"

---

## 🔑 STEP 2: CONFIGURARE AUTHENTICATION

1. Nel menu laterale, vai su **Authentication**
2. Clicca "Inizia"
3. Abilita questi metodi di accesso:
   - ✅ **Email/Password**
   - ✅ **Google**

### Per Google OAuth:
1. Clicca su "Google"
2. Abilita il toggle
3. Inserisci email di supporto
4. Salva

---

## 📊 STEP 3: CONFIGURARE FIRESTORE

1. Nel menu laterale, vai su **Firestore Database**
2. Clicca "Crea database"
3. Seleziona "Inizia in modalità test"
4. Scegli location: **europe-west** (più vicino all'Italia)
5. Clicca "Abilita"

### Regole Firestore (per ora in test):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /quizAttempts/{attemptId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🔐 STEP 4: OTTENERE LE CREDENZIALI

1. Vai su **Impostazioni progetto** (icona ingranaggio)
2. Scorri fino a "Le tue app"
3. Clicca sull'icona **</>** (Web)
4. Nome app: **Patente B 2025 Web**
5. **NON** selezionare Firebase Hosting
6. Clicca "Registra app"
7. Copia le credenziali che appaiono

---

## 📝 STEP 5: CREARE FILE .env

Crea un file `.env` nella root del progetto:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=patente-b-2025.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=patente-b-2025
VITE_FIREBASE_STORAGE_BUCKET=patente-b-2025.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**IMPORTANTE:** 
- Sostituisci i valori con quelli del tuo progetto Firebase
- NON committare il file `.env` su Git
- Il file `.env.example` è già stato creato come template

---

## 🧪 STEP 6: TESTARE L'AUTENTICAZIONE

1. Riavvia il server di sviluppo:
```bash
npm run dev
```

2. Vai su: http://localhost:5173/register

3. Prova a registrarti con:
   - Email e password
   - Google OAuth

4. Vai su: http://localhost:5173/login

5. Prova ad accedere

---

## 📱 STEP 7: VERIFICARE SU FIREBASE CONSOLE

1. Vai su **Authentication** nella console Firebase
2. Dovresti vedere gli utenti registrati nella tab "Users"
3. Vai su **Firestore Database**
4. Dovresti vedere la collection "users" con i documenti degli utenti

---

## ✅ FUNZIONALITÀ IMPLEMENTATE

### AuthContext fornisce:
- `currentUser` - Utente Firebase corrente
- `userData` - Dati utente da Firestore
- `signup(email, password, displayName)` - Registrazione
- `login(email, password)` - Login
- `loginWithGoogle()` - Login con Google
- `logout()` - Logout
- `resetPassword(email)` - Reset password
- `updateUserProfile(displayName, photoURL)` - Aggiorna profilo

### LoginForm include:
- Validazione email e password
- Toggle mostra/nascondi password
- Messaggi di errore user-friendly
- Login con Google
- Link a reset password
- Link a registrazione

### RegisterForm include:
- Validazione completa
- Password strength indicator
- Conferma password con check visivo
- Messaggi di errore dettagliati
- Registrazione con Google
- Accettazione termini e privacy

---

## 🔒 SICUREZZA

### Dati salvati per ogni utente:
```typescript
{
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isPremium: boolean;
  createdAt: Date;
  lastLogin: Date;
  streak: number;
  totalQuizzes: number;
  correctAnswers: number;
  totalAnswers: number;
}
```

---

## 🐛 TROUBLESHOOTING

### Errore: "Firebase: Error (auth/api-key-not-valid)"
- Verifica che le credenziali nel file `.env` siano corrette
- Riavvia il server dopo aver modificato `.env`

### Errore: "Firebase: Error (auth/unauthorized-domain)"
- Vai su Firebase Console → Authentication → Settings → Authorized domains
- Aggiungi `localhost` se non presente

### Errore: "Missing or insufficient permissions"
- Verifica le regole Firestore
- Assicurati che l'utente sia autenticato

---

## 📚 PROSSIMI STEP

Ora che l'autenticazione è configurata, possiamo procedere con:

✅ FASE 3.3: Dashboard con StatCard e ProgressChart
✅ FASE 3.4: Sistema Streak
✅ FASE 3.5: User Profile

---

**🎉 Setup completato! L'autenticazione Firebase è pronta!**

