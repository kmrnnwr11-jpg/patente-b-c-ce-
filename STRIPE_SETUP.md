# 🚀 Guida Setup Backend Stripe

Questa guida spiega come completare la configurazione del backend per i pagamenti Stripe.

---

## 1. Prerequisiti

- Account [Stripe](https://stripe.com) (gratuito)
- Firebase CLI installato (`npm install -g firebase-tools`)
- Node.js 18+

---

## 2. Configura Stripe Dashboard

### 2.1 Crea il Prodotto

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Clicca **+ Add product**
3. Compila:
   - **Name**: Patente B Premium
   - **Pricing model**: Standard pricing
   - **Price**: 20.00 EUR
   - **Billing period**: Monthly
4. Salva e copia il **Price ID** (es. `price_1234...`)

### 2.2 Ottieni le API Keys

1. Vai su [API Keys](https://dashboard.stripe.com/apikeys)
2. Copia:
   - **Publishable key** (pk_test_...) → per il frontend
   - **Secret key** (sk_test_...) → per le Cloud Functions

---

## 3. Deploy Cloud Functions

### 3.1 Configura le chiavi

```bash
cd /Users/kmrnnwr/PATENTE-B-2.0-2

# Login a Firebase
firebase login

# Configura le chiavi Stripe
firebase functions:config:set stripe.secret_key="sk_test_XXXXX"
firebase functions:config:set stripe.webhook_secret="whsec_XXXXX"
```

### 3.2 Installa dipendenze e deploy

```bash
cd functions
npm install
cd ..

# Deploy solo le functions
firebase deploy --only functions
```

### 3.3 Verifica l'URL

Dopo il deploy, vedrai gli URL delle functions:
```
✔ functions[createCheckoutSession]
✔ functions[stripeWebhook]
✔ functions[cancelSubscription]
✔ functions[getSubscriptionStatus]
```

---

## 4. Configura Stripe Webhook

1. Vai su [Webhooks](https://dashboard.stripe.com/webhooks)
2. Clicca **+ Add endpoint**
3. Inserisci l'URL:
   ```
   https://us-central1-patente-b-quiz.cloudfunctions.net/stripeWebhook
   ```
4. Seleziona questi eventi:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia il **Signing secret** (whsec_...)
6. Aggiorna la config:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_XXXXX"
   firebase deploy --only functions
   ```

---

## 5. Aggiorna Flutter

### 5.1 Aggiorna l'URL del backend

In `lib/services/subscription_service.dart`:

```dart
static const String _backendUrl = 
    'https://us-central1-TUO-PROGETTO.cloudfunctions.net';
```

### 5.2 Aggiorna il Price ID

In `lib/services/subscription_service.dart`:

```dart
static const String stripePriceId = 'price_IL_TUO_PRICE_ID';
```

---

## 6. Test il Flusso

### 6.1 Carte di Test

| Numero | Risultato |
|--------|-----------|
| 4242424242424242 | Pagamento riuscito |
| 4000000000000341 | Fallisce dopo l'attacco |
| 4000000000009995 | Fondi insufficienti |

### 6.2 Testa il Flow Completo

1. Avvia l'app
2. Registrati/Login
3. Vai su "Passa a Premium"
4. Completa il checkout con una carta di test
5. Verifica in Firebase Console che:
   - Documento utente → `isPremium: true`
   - Collezione `subscriptions` → nuovo documento

---

## 7. Produzione

Quando sei pronto per andare live:

1. Attiva la modalità live in Stripe Dashboard
2. Sostituisci le chiavi test con quelle live:
   ```bash
   firebase functions:config:set stripe.secret_key="sk_live_XXXXX"
   firebase functions:config:set stripe.webhook_secret="whsec_XXXXX_live"
   ```
3. Crea un nuovo webhook per l'ambiente di produzione
4. Aggiorna il Price ID al prodotto live
5. Re-deploy:
   ```bash
   firebase deploy --only functions
   ```

---

## 🎉 Fatto!

Il tuo sistema di pagamenti è ora configurato. Gli utenti possono:
- Abbonarsi a €20/mese
- Cancellare in qualsiasi momento
- Usare codici promo e referral
- I creator ricevono le loro commissioni automaticamente
