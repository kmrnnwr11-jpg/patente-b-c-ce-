# 🧪 Test Google Login & Sistema Autenticazione

## ✅ Server Attivo

Il server di sviluppo è **già avviato** su:
```
http://localhost:5173
```

---

## 🎯 Test Rapidi

### Test 1: Google Login (1 minuto)

1. **Apri browser**: http://localhost:5173/auth/login
2. **Click**: "Accedi con Google" (button bianco in basso)
3. **Seleziona**: Account Google dal popup
4. **Verifica**: 
   - Redirect automatico a `/dashboard`
   - Avatar con tua iniziale in alto a destra (Navbar)
   - Nome visualizzato accanto all'avatar
5. **Click**: Avatar per aprire dropdown menu
6. **Verifica menu**:
   - Profilo
   - Obiettivi
   - Impostazioni
   - Logout (in rosso)
7. **Click**: "Profilo"
8. **Verifica ProfilePage**:
   - Avatar grande con iniziale
   - Nome completo
   - Email con badge "✓ Verificata"
   - Statistiche (quiz completati, streak, etc.)

**✅ Se tutto funziona**: Google Login è OK!

---

### Test 2: Email Registration (2 minuti)

1. **Apri**: http://localhost:5173/auth/register
2. **Compila form**:
   - Nome: `Mario Rossi`
   - Email: `mario.test@gmail.com` (usa tua email reale)
   - Password: `test123`
   - Conferma: `test123`
3. **Click**: "Crea Account"
4. **Verifica**:
   - Redirect a `/dashboard`
   - **Banner giallo** in alto: "Verifica la tua Email"
   - Avatar in Navbar con iniziale "M"
5. **Controlla email**: Dovresti ricevere email di verifica da Firebase
6. **Click**: Link nell'email
7. **Torna su app**: Click "Ho Verificato" nel banner
8. **Verifica**: Banner scompare

**✅ Se tutto funziona**: Email Registration + Verification OK!

---

### Test 3: Quiz Progress Tracking (3 minuti)

1. **Assicurati**: Di essere loggato (Google o Email)
2. **Vai su**: http://localhost:5173/quiz/2.0
3. **Completa quiz**:
   - Rispondi a 5-10 domande
   - Click "VERO" o "FALSO"
   - Aspetta auto-avanzamento
4. **Alla fine**: Verifica redirect a `/quiz/results`
5. **Vai su**: http://localhost:5173/profile
6. **Verifica statistiche aggiornate**:
   - "Quiz Completati" incrementato di 1
   - "Risposte Corrette" aggiornate
   - "Precisione %" calcolata
   - "Giorni Consecutivi" = 1 (primo quiz)

**✅ Se tutto funziona**: Quiz Progress Tracking OK!

---

### Test 4: Logout e Re-Login (1 minuto)

1. **Click**: Avatar in Navbar (top-right)
2. **Click**: "Esci" (in rosso in fondo al menu)
3. **Verifica**:
   - Redirect a homepage
   - Navbar mostra "Accedi" e "Registrati" (non più avatar)
4. **Click**: "Accedi"
5. **Login**: Con Google o Email
6. **Verifica**:
   - Redirect a `/dashboard`
   - Avatar riappare
   - Statistiche mantenute (non resettate)

**✅ Se tutto funziona**: Logout/Re-Login OK!

---

## 🔍 Verifica Firestore (Opzionale)

### 1. Apri Firebase Console
```
https://console.firebase.google.com/project/patente-b-2025
```

### 2. Vai su Firestore Database
- Click "Firestore Database" nel menu laterale

### 3. Verifica Collections

#### Collection: `users`
- Dovresti vedere 1+ documenti
- Ogni documento ha:
  - `uid`: ID utente
  - `email`: Email utente
  - `displayName`: Nome
  - `photoURL`: URL foto (se Google)
  - `isPremium`: false
  - `totalQuizzes`: numero quiz completati
  - `correctAnswers`: risposte corrette
  - `totalAnswers`: totale risposte
  - `streak`: giorni consecutivi
  - `createdAt`: data creazione
  - `lastLogin`: ultimo accesso

#### Collection: `quiz_attempts`
- Dovresti vedere 1+ documenti (se hai fatto quiz)
- Ogni documento ha:
  - `attemptId`: ID tentativo
  - `userId`: ID utente
  - `questions`: array domande con risposte
  - `score`: punteggio
  - `errors`: errori
  - `timeElapsed`: tempo impiegato
  - `mode`: "practice" | "exam" | "topic"
  - `passed`: true/false
  - `startedAt`: data inizio
  - `completedAt`: data fine

**✅ Se vedi i dati**: Firestore integration OK!

---

## 🐛 Troubleshooting

### Problema: Google Login non funziona
**Soluzione**:
1. Verifica che Firebase Auth sia configurato
2. Controlla console browser per errori
3. Verifica che domini siano autorizzati in Firebase Console:
   - Vai su Authentication → Settings → Authorized domains
   - Aggiungi `localhost` se non presente

### Problema: Email di verifica non arriva
**Soluzione**:
1. Controlla cartella spam
2. Verifica che email sia corretta
3. Attendi 1-2 minuti (può essere lento)
4. Prova "Reinvia Email" nel banner

### Problema: Quiz non salvato in Firestore
**Soluzione**:
1. Verifica di essere loggato
2. Controlla console browser per errori
3. Verifica Firestore rules in Firebase Console
4. I dati sono comunque salvati in localStorage (fallback)

### Problema: Avatar non appare
**Soluzione**:
1. Fai refresh della pagina (F5)
2. Verifica che login sia completato
3. Controlla console per errori
4. Prova logout e re-login

---

## 📊 Checklist Completa

### Autenticazione
- [ ] Google Login funziona
- [ ] Email Registration funziona
- [ ] Email Verification banner appare
- [ ] Reinvia email funziona
- [ ] Phone Login (testare su produzione)
- [ ] Logout funziona
- [ ] Re-login mantiene dati

### UI/UX
- [ ] Navbar mostra avatar quando loggato
- [ ] Dropdown menu si apre/chiude
- [ ] ProfilePage mostra statistiche
- [ ] EmailVerificationBanner appare se non verificato
- [ ] Banner è dismissable
- [ ] Responsive su mobile

### Quiz Progress
- [ ] Quiz si salva in Firestore
- [ ] Statistiche si aggiornano in ProfilePage
- [ ] Streak si incrementa
- [ ] Tempo impiegato viene tracciato
- [ ] Fallback localStorage funziona

### Firestore
- [ ] Collection `users` creata
- [ ] Collection `quiz_attempts` creata
- [ ] Dati utente salvati correttamente
- [ ] Risultati quiz salvati correttamente

---

## 🎯 Test di Accettazione

### Scenario 1: Nuovo Utente Google
```
1. Utente apre app
2. Click "Accedi"
3. Click "Accedi con Google"
4. Seleziona account
5. Redirect a dashboard
6. Vede avatar in navbar
7. Click avatar → vede menu
8. Click "Profilo" → vede stats (0 quiz)
9. Fa un quiz
10. Torna su profilo → vede stats aggiornate
```

### Scenario 2: Nuovo Utente Email
```
1. Utente apre app
2. Click "Registrati"
3. Compila form email
4. Click "Crea Account"
5. Redirect a dashboard
6. Vede banner "Verifica Email"
7. Riceve email
8. Click link nell'email
9. Torna su app
10. Click "Ho Verificato"
11. Banner scompare
```

### Scenario 3: Utente Esistente
```
1. Utente apre app
2. Click "Accedi"
3. Login con Google o Email
4. Redirect a dashboard
5. Vede avatar
6. Vede statistiche mantenute
7. Fa un quiz
8. Statistiche si aggiornano
9. Logout
10. Re-login → dati ancora presenti
```

---

## 📱 Test Mobile (Opzionale)

### 1. Apri su Mobile
- Usa stesso URL: http://localhost:5173
- Oppure usa IP locale: http://192.168.X.X:5173

### 2. Verifica Responsive
- [ ] Navbar nasconde nome utente su mobile
- [ ] Avatar rimane visibile
- [ ] Dropdown menu funziona
- [ ] LoginPage responsive
- [ ] RegisterPage responsive
- [ ] ProfilePage responsive
- [ ] Quiz funziona su mobile

---

## 🚀 Deploy su Produzione (Prossimo Step)

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Segui wizard
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Segui wizard
```

### Post-Deploy
1. Configura domini in Firebase Console
2. Testa Phone Auth (funziona solo su dominio pubblico)
3. Verifica tutti i test sopra
4. Configura Firestore security rules

---

## ✅ Tutto OK?

Se tutti i test passano:

🎉 **Sistema di autenticazione completo e funzionante!**

Puoi ora:
- Usare l'app con login Google/Email
- Tracciare progressi quiz
- Vedere statistiche in tempo reale
- Gestire profilo utente

---

**Prossimi Step**:
1. Implementare Password Reset
2. Aggiungere Premium features (Stripe)
3. Implementare Quiz History dashboard
4. Deploy su produzione

---

**Server attivo**: http://localhost:5173
**Inizia test**: http://localhost:5173/auth/login

🚀 **Buon test!**

