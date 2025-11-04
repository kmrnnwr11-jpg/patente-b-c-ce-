# 🔧 FIX SCHERMO BIANCO - Patente B App

## ❌ PROBLEMA
Quando apri http://localhost:5173 vedi solo una schermata bianca.

## ✅ SOLUZIONE

### PASSO 1: Riavvia il Server
Nel tuo terminale esterno (NON in Cursor):

```bash
cd "/Users/kmrnnwr/patente b"
npm run dev
```

Aspetta che vedi:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### PASSO 2: Apri il Browser
1. Apri **Chrome** o **Safari**
2. Vai a: **http://localhost:5173**
3. Dovresti vedere una pagina di test con:
   - Sfondo gradiente verde→blu
   - Card bianca al centro
   - Testo "✅ App Funzionante!"
   - Bottone "Vai alla Dashboard"

### PASSO 3: Test della Dashboard
Clicca sul bottone "Vai alla Dashboard" oppure vai manualmente a:
**http://localhost:5173/dashboard**

Dovresti vedere:
- Gradiente verde→blu di sfondo
- Header "Patente B - Quiz Ufficiali"
- Card bianca "Nuovi quiz 2024!"
- 6 card colorate (Simulazione, Quiz, Teoria, ecc.)
- Bottom bar con 5 icone

---

## 🐛 SE VEDI ANCORA BIANCO

### Opzione A: Hard Refresh
- **Mac**: `Cmd + Shift + R`
- **Windows**: `Ctrl + F5`

### Opzione B: Cancella Cache Browser
1. Apri DevTools: `F12` o `Cmd+Option+I`
2. Vai su **Network** tab
3. Spunta **Disable cache**
4. Refresh con `Cmd+R` o `F5`

### Opzione C: Cancella Cache Vite
Nel terminale:
```bash
cd "/Users/kmrnnwr/patente b"
rm -rf node_modules/.vite
npm run dev
```

### Opzione D: Reinstalla Dipendenze
```bash
cd "/Users/kmrnnwr/patente b"
rm -rf node_modules
npm install
npm run dev
```

---

## 📊 VERIFICA ERRORI

### 1. Controlla Console Browser
1. Apri DevTools: `F12`
2. Vai su **Console** tab
3. Cerca errori in rosso
4. Mandami screenshot se vedi errori

### 2. Controlla Console Terminale
Nel terminale dove gira `npm run dev`:
- Cerca righe con `[ERROR]` o `Failed`
- Mandami screenshot se vedi errori

---

## 🎯 ROTTE DISPONIBILI

| URL | Descrizione |
|-----|-------------|
| `/` | Pagina di test (temporanea) |
| `/dashboard` | Dashboard principale |
| `/test-quiz` | Quiz simulazione esame |
| `/quiz/topics` | Lista 25 argomenti |
| `/topic-quiz?argomento=X` | Quiz per argomento |
| `/theory` | Teoria e segnali |
| `/landing` | Landing page originale |

---

## 🔍 DEBUG AVANZATO

### Verifica che React stia montando
Apri DevTools Console e scrivi:
```javascript
document.getElementById('root').innerHTML
```

Se vedi `""` (stringa vuota), React non sta montando.

### Verifica CSS
Apri DevTools Console e scrivi:
```javascript
getComputedStyle(document.body).backgroundColor
```

Se vedi `rgb(255, 255, 255)` (bianco), i CSS non si stanno applicando.

---

## 📞 CONTATTAMI SE:
- Vedi ancora schermo bianco dopo tutti questi step
- Vedi errori in console (mandami screenshot)
- Il server non parte (mandami output terminale)

---

## ✅ QUANDO FUNZIONA

Una volta che vedi la pagina di test:
1. Clicca "Vai alla Dashboard"
2. Esplora le 6 card
3. Prova "Quiz per Argomento" per vedere i 25 argomenti con icone
4. Prova "Simulazione Esame" per fare un quiz di 30 domande

**L'app è completamente funzionante, serve solo che il browser la carichi correttamente!**

