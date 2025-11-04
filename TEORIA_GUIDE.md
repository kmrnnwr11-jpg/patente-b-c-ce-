# 📚 GUIDA TEORIA - Patente B App

## ✅ TEORIA IMPLEMENTATA

Ho creato la struttura completa della teoria con **25 capitoli ministeriali**.

---

## 📂 FILE CREATI

### 1. `src/data/theory-structure.json`
Contiene tutti i 25 capitoli con:
- **ID** univoco
- **Titolo** del capitolo
- **Icona** (Lucide React)
- **Ordine** (1-25)
- **Sezioni** con titolo e contenuto

### 2. `src/pages/TheoryDetailPage.tsx`
Pagina per visualizzare il contenuto di un capitolo:
- Header con titolo e numero capitolo
- Sezioni numerate con contenuto
- Bottoni: "Indice" e "Fai Quiz"

### 3. `src/pages/TheoryPage.tsx` (aggiornato)
Ora naviga ai dettagli della teoria invece che ai quiz.

---

## 🎯 COME USARE

### 1. Vai alla Teoria
```
http://localhost:5173/theory
```

### 2. Seleziona un Argomento
Clicca su una delle 25 card colorate (es: "Segnali di Pericolo")

### 3. Leggi il Contenuto
Vedrai:
- Titolo del capitolo
- Numero capitolo (es: "Capitolo 1 di 25")
- Sezioni numerate con spiegazioni

### 4. Fai il Quiz
Clicca "Fai Quiz →" per esercitarti sull'argomento

---

## 📖 CAPITOLI DISPONIBILI

| # | Capitolo | Contenuto |
|---|----------|-----------|
| 1 | Segnali di Pericolo | Caratteristiche, distanza collocazione |
| 2 | Segnali di Precedenza | STOP, dare precedenza |
| 3 | Segnali di Divieto | Caratteristiche generali |
| 4 | Segnali di Obbligo | Caratteristiche generali |
| 5 | Segnali di Indicazione | Tipologie |
| 6 | Norme sulla Precedenza | Regola destra, rotatorie |
| 7 | Limiti di Velocità | Autostrade, extraurbane, urbane |
| 8 | Distanza di Sicurezza | Come calcolarla |
| 9 | Sorpasso | Quando vietato, come effettuarlo |
| 10 | Fermata, Sosta, Arresto | Definizioni, divieti |
| 11 | Norme di Circolazione | Marcia sulla destra |
| 12 | Segnaletica Orizzontale | Strisce continue/discontinue |
| 13 | Semafori e Vigili | Significato luci |
| 14 | Luci e Dispositivi | Anabbaglianti, abbaglianti |
| 15 | Cinture e Casco | Obblighi |
| 16 | Elementi Veicolo | Pneumatici, freni |
| 17 | Patente e Documenti | Sistema punti, documenti |
| 18 | Alcool e Primo Soccorso | Limiti, cosa fare |
| 19 | Incidenti Stradali | Comportamenti |
| 20 | Responsabilità e RCA | Assicurazione obbligatoria |
| 21 | Ambiente | Guida ecologica |
| 22 | Autostrade | Pedaggi, norme |
| 23 | Segnali Cantieri | Pannelli integrativi |
| 24 | Definizioni Stradali | Carreggiata, corsia |
| 25 | Pannelli Integrativi | Funzione |

---

## 🔧 COME AGGIUNGERE CONTENUTO

### Opzione A: Manualmente
Modifica `src/data/theory-structure.json`:

```json
{
  "id": "segnali-pericolo",
  "title": "Segnali di Pericolo",
  "icon": "AlertTriangle",
  "order": 1,
  "sections": [
    {
      "id": "nuova-sezione",
      "title": "Titolo Sezione",
      "content": "Contenuto dettagliato qui..."
    }
  ]
}
```

### Opzione B: Dal PDF
Se hai il PDF `scuolaguida-manuale-teoria-A1-A-B.pdf`:

1. Apri il PDF
2. Copia il testo di ogni capitolo
3. Incollalo nel campo `content` della sezione corrispondente
4. Formatta il testo per renderlo leggibile

---

## 📝 ESEMPIO CONTENUTO COMPLETO

```json
{
  "id": "limiti-velocita",
  "title": "Limiti di Velocità",
  "icon": "Gauge",
  "order": 7,
  "sections": [
    {
      "id": "autostrade",
      "title": "Autostrade",
      "content": "In autostrada il limite massimo è 130 km/h (110 km/h in caso di pioggia). Il limite minimo è 60 km/h. Le autostrade sono strade extraurbane con carreggiate separate da spartitraffico invalicabile."
    },
    {
      "id": "extraurbane",
      "title": "Strade extraurbane principali",
      "content": "Sulle strade extraurbane principali il limite è 110 km/h (90 km/h in caso di pioggia). Queste strade hanno almeno una corsia per senso di marcia."
    }
  ]
}
```

---

## 🎨 PERSONALIZZAZIONE

### Cambiare Icone
Modifica il campo `icon` in `theory-structure.json`:

Icone disponibili (Lucide React):
- `AlertTriangle` - Pericolo
- `Shield` - Obbligo
- `Ban` - Divieto
- `Eye` - Indicazione
- `Gauge` - Velocità
- `Clock` - Tempo
- `Car` - Veicolo
- `Users` - Persone
- Altre su: https://lucide.dev

### Cambiare Ordine
Modifica il campo `order` (1-25)

---

## 🚀 PROSSIMI STEP

### 1. Aggiungere Immagini
```json
{
  "id": "esempio",
  "title": "Esempio",
  "content": "Testo...",
  "images": [
    "/images/theory/segnale-stop.png",
    "/images/theory/segnale-precedenza.png"
  ]
}
```

### 2. Aggiungere Video
```json
{
  "id": "esempio",
  "title": "Esempio",
  "content": "Testo...",
  "videoUrl": "https://youtube.com/embed/..."
}
```

### 3. Aggiungere Audio
Usa ElevenLabs per generare audio del testo:
```json
{
  "id": "esempio",
  "title": "Esempio",
  "content": "Testo...",
  "audioUrl": "/audio/theory/limiti-velocita.mp3"
}
```

---

## ✅ FUNZIONALITÀ ATTUALI

- ✅ 25 capitoli ministeriali
- ✅ Navigazione tra teoria e quiz
- ✅ Design responsive
- ✅ Icone per ogni argomento
- ✅ Sezioni numerate
- ✅ Bottone "Fai Quiz" per esercitarsi

## 🔜 DA IMPLEMENTARE

- ⏳ Contenuto completo da PDF
- ⏳ Immagini segnali stradali
- ⏳ Audio text-to-speech
- ⏳ Bookmark capitoli preferiti
- ⏳ Progress tracking (% completamento)
- ⏳ Quiz integrati nella teoria

---

## 📞 COME ESPANDERE

Per aggiungere più contenuto da un PDF o altro materiale:

1. Apri `src/data/theory-structure.json`
2. Trova il capitolo da espandere (es: `"id": "segnali-pericolo"`)
3. Aggiungi nuove sezioni nell'array `sections`:
   ```json
   {
     "id": "nuova-sezione",
     "title": "Titolo",
     "content": "Contenuto dettagliato..."
   }
   ```
4. Salva e ricarica l'app

**La teoria è pronta per essere espansa con tutto il contenuto del manuale!**

