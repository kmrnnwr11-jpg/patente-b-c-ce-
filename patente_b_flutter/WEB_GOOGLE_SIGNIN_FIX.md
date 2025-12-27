# Come Trovare il Web Client ID per Google Sign-In

## 🔍 Problema

L'errore che vedi:
```
clientID not set. Either set it on a <meta name='google-signin-client_id'> tag
```

Significa che Flutter Web ha bisogno del **Web Client ID** OAuth di Google per far funzionare Google Sign-In sul browser.

---

## ✅ Soluzione - Due Metodi

### Metodo 1: Firebase Console (PIÙ FACILE)

1. **Vai su Firebase Console**:
   - https://console.firebase.google.com

2. **Seleziona il tuo progetto**:
   - Clicca sul progetto "patente-b-flutter" o il nome del tuo progetto

3. **Settings del progetto**:
   - Clicca sull'icona ⚙️ in alto a sinistra
   - Clicca "Project settings"

4. **Scorri fino a "Your apps"**:
   - Vedrai le tue app (Android, iOS, Web)

5. **Trova la Web app**:
   - Nella sezione "Web apps" (simbolo `</>`), clicca su "Your app" o "Web app"

6. **Copia il Web client ID**:
   - Cerca "Web client ID" nelle SDK configuration
   - Formato: `xxxxx-xxxxxxx.apps.googleusercontent.com`
   - **Copia questo valore!**

### Metodo 2: Google Cloud Console

1. **Vai su Google Cloud Console**:
   - https://console.cloud.google.com

2. **Seleziona il progetto**:
   - Assicurati che sia lo stesso progetto Firebase

3. **APIs & Services > Credentials**:
   - Nel menu a sinistra: **APIs & Services**
   - Poi **Credentials**

4. **Trova OAuth 2.0 Client IDs**:
   - Vedrai una lista di Client IDs
   - Cerca quello con **Type: Web client** o **Web application**

5. **Copia il Client ID**:
   - Clicca sul nome per vedere i dettagli
   - **Client ID**: `xxxxx-xxxxxxx.apps.googleusercontent.com`
   - **Copia questo!**

---

## 🔧 Configurazione (GIÀ FATTO!)

Ho già aggiunto il meta tag nel file `web/index.html`. Devi solo sostituire il placeholder:

**File**: `web/index.html`

**Riga da modificare**:
```html
<meta name="google-signin-client_id" content="YOUR_WEB_CLIENT_ID.apps.googleusercontent.com">
```

**Sostituisci con il tuo Client ID**:
```html
<meta name="google-signin-client_id" content="123456789-abcdefghijk.apps.googleusercontent.com">
```

(Usa il valore che hai copiato da Firebase/Google Cloud)

---

## 📝 Esempio Completo

Se il tuo Web Client ID è: `987654321-abc123xyz.apps.googleusercontent.com`

Allora la riga diventa:
```html
<meta name="google-signin-client_id" content="987654321-abc123xyz.apps.googleusercontent.com">
```

---

## 🚀 Dopo la Modifica

1. **Salva il file** `web/index.html`

2. **Riavvia Flutter**:
   ```bash
   # Fermata app nel terminale (Ctrl+C)
   flutter run -d chrome
   ```

3. **Testa Google Sign-In**:
   - Clicca su "Continua con Google"
   - Dovrebbe aprirsi il popup di autenticazione Google
   - Niente più errori!

---

## ⚠️ Note Importanti

### Non Committare il Client ID? 

**NON È UN PROBLEMA!** Il Web Client ID **NON è segreto** e può essere committato su Git senza problemi. È diverso dal Client Secret.

- ✅ **Web Client ID**: Può essere pubblico
- ❌ **Client Secret**: DEVE rimanere segreto (ma non lo usiamo qui)

### Solo per Web

Questo fix è **solo per Flutter Web** (browser). Le app Android e iOS non hanno bisogno di questo meta tag perché usano una configurazione diversa.

### Alternative

Se non vuoi mettere il Client ID nell'HTML, puoi passarlo quando inizializzi `GoogleSignIn` nel codice Dart:

```dart
final GoogleSignIn _googleSignIn = GoogleSignIn(
  clientId: 'TUO_WEB_CLIENT_ID.apps.googleusercontent.com',
);
```

Ma il metodo del meta tag è **più semplice e raccomandato**.

---

## 🆘 Problemi?

### Non Trovo il Web Client ID

**Soluzione**: Crea una nuova Web app in Firebase Console:

1. Firebase Console > Project Settings
2. Scroll down to "Your apps"
3. Se non vedi una Web app, clicca "Add app" → Web (`</>`)
4. Segui il wizard
5. Copia il Web Client ID generato

### Client ID sbagliato?

**Verifica**:
- Il formato deve essere: `numeri-caratteri.apps.googleusercontent.com`
- NO spazi prima/dopo
- NO virgolette dentro il content (solo nell'HTML)

### Ancora errore dopo fix?

**Prova**:
1. Clear cache browser (Cmd+Shift+R su Mac)
2. Riavvia `flutter run -d chrome`
3. Verifica che il meta tag sia nell'HTML (view source)

---

## ✅ Checklist

- [ ] Trovato Web Client ID da Firebase Console
- [ ] Copiato il valore completo (formato: xxx.apps.googleusercontent.com)
- [ ] Modificato `web/index.html` sostituendo `YOUR_WEB_CLIENT_ID`
- [ ] Salvato il file
- [ ] Riavviato Flutter app
- [ ] Testato Google Sign-In
- [ ] Funziona! 🎉

---

**Dopo questo fix, Google Sign-In funzionerà perfettamente sul web!** 🚀

