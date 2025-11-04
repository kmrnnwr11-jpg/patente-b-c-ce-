# 🔥 GUIDA SETUP SUPABASE

## 📋 COSA ABBIAMO CREATO

✅ **Supabase Configuration** (`src/lib/supabase.ts`)
✅ **AuthContext aggiornato** (`src/contexts/AuthContext.tsx`)
✅ **Componenti aggiornati** per usare Supabase invece di Firebase

---

## 🚀 STEP 1: CREARE PROGETTO SUPABASE

1. Vai su https://supabase.com/
2. Clicca su "Start your project" o "Sign In"
3. Clicca su "New Project"
4. Compila i dati:
   - **Nome progetto**: `patente-b-2025`
   - **Database Password**: Genera una password forte (salvala!)
   - **Region**: `West Europe (Ireland)` o `Central EU (Frankfurt)`
5. Clicca "Create new project"
6. Aspetta che il progetto venga creato (circa 2 minuti)

---

## 🔑 STEP 2: OTTENERE LE CREDENZIALI

1. Vai su **Settings** (icona ingranaggio in basso a sinistra)
2. Vai su **API**
3. Trova la sezione **Project API keys**
4. Copia questi valori:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (chiave pubblica)

---

## 📝 STEP 3: CONFIGURARE LE VARIABILI D'AMBIENTE

1. Copia il file `.env.example` in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Apri il file `.env` e inserisci le tue credenziali:
   ```bash
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **IMPORTANTE**: Non committare mai il file `.env` su Git!

---

## 📊 STEP 4: CREARE LA TABELLA USERS

1. Vai su **SQL Editor** nel menu laterale di Supabase
2. Clicca su **New Query**
3. Copia tutto il contenuto del file `supabase-setup.sql`
4. Incollalo nell'editor SQL
5. Clicca **Run** (o premi Cmd/Ctrl + Enter)
6. Dovresti vedere "Success. No rows returned"

---

## 🔐 STEP 5: CONFIGURARE GOOGLE OAUTH (OPZIONALE)

### 1. Configurare Google Cloud Console

1. Vai su https://console.cloud.google.com/
2. Crea un nuovo progetto o seleziona uno esistente
3. Vai su **APIs & Services** → **Credentials**
4. Clicca **Create Credentials** → **OAuth client ID**
5. Scegli **Web application**
6. Aggiungi questi URL:
   - **Authorized JavaScript origins**: `https://xxxxx.supabase.co`
   - **Authorized redirect URIs**: `https://xxxxx.supabase.co/auth/v1/callback`
7. Copia **Client ID** e **Client Secret**

### 2. Configurare in Supabase

1. Vai su **Authentication** → **Providers**
2. Trova **Google** e clicca su "Enable"
3. Inserisci:
   - **Client ID**: il tuo Client ID da Google
   - **Client Secret**: il tuo Client Secret da Google
4. Clicca **Save**

---

## 🧪 STEP 6: TESTARE L'AUTENTICAZIONE

1. Riavvia il server di sviluppo:
   ```bash
   npm run dev
   ```

2. Vai su: http://localhost:5173/register

3. Prova a registrarti con:
   - Email e password
   - Google OAuth (se configurato)

4. Vai su: http://localhost:5173/login

5. Prova ad accedere

---

## 📱 STEP 7: VERIFICARE SU SUPABASE DASHBOARD

1. Vai su **Authentication** → **Users**
   - Dovresti vedere gli utenti registrati

2. Vai su **Table Editor** → **users**
   - Dovresti vedere i profili degli utenti nella tabella `users`

---

## ✅ FUNZIONALITÀ IMPLEMENTATE

### AuthContext fornisce:
- `currentUser` - Utente Supabase corrente (tipo `User` da `@supabase/supabase-js`)
- `userData` - Dati utente da tabella `users` (tipo `UserData`)
- `signup(email, password, displayName)` - Registrazione
- `login(email, password)` - Login
- `loginWithGoogle()` - Login con Google OAuth
- `logout()` - Logout
- `resetPassword(email)` - Reset password
- `updateUserProfile(displayName, photoURL)` - Aggiorna profilo

### Struttura dati UserData:
```typescript
{
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  created_at: string;
  last_login: string;
  streak: number;
  total_quizzes: number;
  correct_answers: number;
  total_answers: number;
}
```

---

## 🔒 SICUREZZA

### Row Level Security (RLS)
Le policy RLS garantiscono che:
- Gli utenti possono leggere solo il proprio profilo
- Gli utenti possono aggiornare solo il proprio profilo
- Gli utenti possono inserire solo il proprio profilo

### Trigger automatici
- Quando un nuovo utente si registra, viene creato automaticamente il profilo nella tabella `users`
- Il campo `updated_at` viene aggiornato automaticamente ad ogni modifica

---

## 🐛 TROUBLESHOOTING

### Errore: "relation 'users' does not exist"
- Verifica di aver eseguito lo script SQL `supabase-setup.sql`
- Controlla che la tabella sia stata creata correttamente nel Table Editor

### Errore: "new row violates row-level security policy"
- Verifica che le policy RLS siano state create correttamente
- Controlla che l'utente sia autenticato

### Errore: "Invalid API key"
- Verifica che le credenziali nel file `.env` siano corrette
- Assicurati di usare la chiave `anon public`, non la chiave `service_role`

### Google OAuth non funziona
- Verifica che gli URL di redirect in Google Console siano corretti
- Controlla che Google provider sia abilitato in Supabase

---

## 📚 PROSSIMI STEP

Ora che Supabase è configurato, puoi:

✅ Usare l'autenticazione nell'app
✅ Salvare i dati degli utenti nella tabella `users`
✅ Implementare funzionalità premium
✅ Tracciare statistiche utenti

---

**🎉 Setup completato! Supabase è pronto per essere usato!**

