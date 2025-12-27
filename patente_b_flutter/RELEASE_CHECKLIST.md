# 📋 Checklist Pre-Pubblicazione App Store & Play Store

## Status: ⏳ IN PREPARAZIONE

Questa checklist ti guiderà passo-passo verso la pubblicazione dell'app "Quiz Patente B C CE" su Google Play Store e Apple App Store.

---

## ✅ Configurazione Base (COMPLETATO)

- [x] Nome app aggiornato a "Quiz Patente B C CE"
- [x] Permessi INTERNET aggiunti ad AndroidManifest.xml
- [x] minSdk impostato a 21 (Android 5.0+)
- [x] targetSdk impostato a 34 (requirement Play Store)
- [x] Bundle ID Android: `com.patenteb.patente_b_flutter`
- [x] Descrizione app aggiornata in pubspec.yaml
- [x] Deep linking configurato (patenteapp://)

---

## 🔐 Android Release Signing (DA FARE)

### Step 1: Generare Keystore

- [ ] **Eseguire comando generazione keystore**
  ```bash
  keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
  ```
  
- [ ] **Salvare informazioni keystore**:
  - [ ] Password keystore salvata in password manager
  - [ ] Password chiave salvata  
  - [ ] Alias: `upload`
  - [ ] File keystore salvato in luogo sicuro
  - [ ] Backup keystore creato

### Step 2: Configurare key.properties

- [ ] **Creare file `android/key.properties`**:
  ```bash
  cd android
  nano key.properties
  ```

- [ ] **Aggiungere contenuto** (sostituire con valori reali):
  ```properties
  storePassword=TUA_PASSWORD
  keyPassword=TUA_PASSWORD
  keyAlias=upload
  storeFile=/percorso/completo/upload-keystore.jks
  ```

- [ ] **Verificare che key.properties sia in .gitignore** (già presente ✓)

### Step 3: Aggiornare build.gradle.kts

- [ ] **Aggiungere codice per leggere key.properties** (prima di `android {}`):
  ```kotlin
  val keystorePropertiesFile = rootProject.file("key.properties")
  val keystoreProperties = java.util.Properties()
  
  if (keystorePropertiesFile.exists()) {
      keystorePropertiesFile.inputStream().use { stream ->
          keystoreProperties.load(stream)
      }
  }
  ```

- [ ] **Aggiungere signingConfigs** (dentro `android {}`):
  ```kotlin
  signingConfigs {
      create("release") {
          if (keystorePropertiesFile.exists()) {
              keyAlias = keystoreProperties["keyAlias"] as String
              keyPassword = keystoreProperties["keyPassword"] as String
              storeFile = file(keystoreProperties["storeFile"] as String)
              storePassword = keystoreProperties["storePassword"] as String
          }
      }
  }
  ```

- [ ] **Aggiornare buildTypes release**:
  ```kotlin
  buildTypes {
      release {
          signingConfig = signingConfigs.getByName("release")
      }
  }
  ```

### Step 4: Test Build Release Android

- [ ] **Build APK release**:
  ```bash
  cd /Users/kmrnnwr/PATENTE-B-2.0-2/patente_b_flutter
  flutter build apk --release
  ```

- [ ] **Build App Bundle** (preferito per Play Store):
  ```bash
  flutter build appbundle --release
  ```

- [ ] **Verificare firma**:
  ```bash
  jarsigner -verify -verbose -certs build/app/outputs/bundle/release/app-release.aab
  ```

- [ ] **Test su dispositivo reale**:
  - [ ] Installare APK da `build/app/outputs/flutter-apk/app-release.apk`
  - [ ] Verificare tutte le funzionalità
  - [ ] Test Firebase authentication
  - [ ] Test caricamento quiz
  - [ ] Test simulazioni

---

## 🍎 iOS Release Configuration (DA FARE)

### Step 1: Xcode Setup

- [ ] **Aprire progetto in Xcode**:
  ```bash
  open ios/Runner.xcworkspace
  ```

- [ ] **Configurare Team**:
  - [ ] Selezionare Runner in navigator
  - [ ] Signing & Capabilities tab
  - [ ] Selezionare il tuo Apple Developer Team
  - [ ] Verificare Bundle Identifier: `com.patenteb.patente_b_flutter`

- [ ] **Configurare versione**:
  - [ ] Version: 1.0.0
  - [ ] Build: 1

### Step 2: Icone App iOS

- [ ] **Aggiungere AppIcon completo**:
  - [ ] Aprire `ios/Runner/Assets.xcassets/AppIcon.appiconset`
  - [ ] Aggiungere icone per tutte le dimensioni richieste
  - [ ] Icona 1024x1024 per App Store (senza alpha)

### Step 3: Test Build Release iOS

- [ ] **Build IPA**:
  ```bash
  flutter build ipa
  ```

- [ ] **Test su dispositivo reale** (tramite TestFlight o direct install)

---

## 🎨 Assets e Design (DA FARE)

### Icone App

**Android:**
- [ ] **Icona 512x512** per Play Store (PNG 32-bit)
- [ ] **Icone launcher** in `android/app/src/main/res/mipmap-*/`:
  - [ ] mdpi (48x48)
  - [ ] hdpi (72x72)
  - [ ] xhdpi (96x96)
  - [ ] xxhdpi (144x144)
  - [ ] xxxhdpi (192x192)
- [ ] **Adaptive icon** (foreground + background)

**iOS:**
- [ ] **Icona 1024x1024** per App Store (PNG senza alpha)
- [ ] **AppIcon set completo** in Assets.xcassets

### Screenshot Store

**Android (Play Store):**
- [ ] Almeno 2 screenshot phone (1080x1920 o superiore)
- [ ] Screenshot suggeriti:
  - [ ] Dashboard principale
  - [ ] Quiz in azione
  - [ ] Teoria con immagini
  - [ ] Statistiche/progressi
  - [ ] Simulazione esame

**iOS (App Store):**
- [ ] Almeno 3 screenshot per iPhone (6.7": 1290x2796)
- [ ] Screenshot suggeriti: stessi di Android

### Feature Graphic (Android)

- [ ] **Feature graphic** 1024x500 px per Play Store

### Splash Screen

- [ ] Splash screen Android configurato
- [ ] Launch screen iOS configurato

---

## 📝 Store Listings (DA FARE)

### Google Play Store

- [ ] **Titolo app**: "Quiz Patente B C CE 2025" (max 50 caratteri)
- [ ] **Descrizione breve** (max 80 caratteri)
- [ ] **Descrizione completa** (max 4000 caratteri) - vedere `STORE_LISTINGS.md`
- [ ] **Categoria**: Istruzione
- [ ] **Email contatto**: support@patenteapp.com (o altro)
- [ ] **Privacy Policy URL**: [da pubblicare]
- [ ] **Rating contenuto** (PEGI/ESRB)
- [ ] **Paesi target**: Italia (almeno, altri opzionali)

### Apple App Store

- [ ] **Nome app**: "Quiz Patente B C CE 2025" (max 30 caratteri)
- [ ] **Sottotitolo**: "Quiz, Teoria e Simulazioni" (max 30 caratteri)
- [ ] **Descrizione** (max 4000 caratteri) - vedere `STORE_LISTINGS.md`
- [ ] **Parole chiave** (max 100 caratteri totali)
- [ ] **Categoria**: Education
- [ ] **Privacy Policy URL**: [da pubblicare]
- [ ] **Support URL**: [da pubblicare]
- [ ] **Marketing URL** (opzionale)
- [ ] **Copyright**: © 2025 [Tuo Nome/Azienda]

---

## 🔐 Privacy & Compliance (DA FARE)

### Privacy Policy

- [ ] **Revisionare template** `PRIVACY_POLICY.md`
- [ ] **Personalizzare con dati reali**:
  - [ ] Email contatto: privacy@patenteapp.com
  - [ ] Indirizzo postale (se richiesto)
  - [ ] Nome azienda/persona
  - [ ] DPO (se applicabile)
  
- [ ] **Pubblicare online**:
  - Opzioni:
    - [ ] Sito web proprietario: https://patenteapp.com/privacy
    - [ ] GitHub Pages
    - [ ] Firebase Hosting
    - [ ] Servizio terzo (Termsfeed, etc.)

- [ ] **Verificare URL accessibile pubblicamente**

### Terms of Service (opzionale ma consigliato)

- [ ] Creare Terms of Service
- [ ] Pubblicare online
- [ ] Link in app (footer o settings)

### GDPR Compliance (per utenti EU)

- [ ] Privacy Policy conforme GDPR
- [ ] Meccanismo per richieste utenti:
  - [ ] Accesso dati
  - [ ] Cancellazione dati
  - [ ] Esportazione dati
- [ ] Email dedicata: privacy@patenteapp.com

### Firebase Configuration

- [ ] **Android**: `google-services.json` presente e configurato
- [ ] **iOS**: `GoogleService-Info.plist` presente e configurato
- [ ] Firebase project in produzione (non debug)
- [ ] Firestore rules configurate correttamente
- [ ] Storage rules configurate (se usato)

---

## 🧪 Testing Finale (DA FARE)

### Test Funzionali

- [ ] **Login/Registrazione**:
  - [ ] Email + password
  - [ ] Google Sign-In
  - [ ] Accesso come ospite
  - [ ] Logout

- [ ] **Quiz**:
  - [ ] Caricamento quiz Patente B
  - [ ] Caricamento quiz Patente C
  - [ ] Caricamento quiz Patente CE
  - [ ] Risposta domande
  - [ ] Statistiche aggiornate

- [ ] **Teoria**:
  - [ ] Caricamento capitoli
  - [ ] Visualizzazione immagini
  - [ ] Segnali stradali

- [ ] **Simulazioni**:
  - [ ] Avvio simulazione
  - [ ] Timer 30 minuti
  - [ ] Correzione finale
  - [ ] Salvataggio risultati

- [ ] **Multilingua**:
  - [ ] Traduzione funzionante
  - [ ] Audio TTS (se disponibile)

- [ ] **Offline**:
  - [ ] Funzionalità base senza internet
  - [ ] Sync quando torna online

### Test Tecnici

- [ ] **Performance**:
  - [ ] Avvio rapido (<3 secondi)
  - [ ] Navigazione fluida
  - [ ] No lag o freeze

- [ ] **Memoria**:
  - [ ] No memory leaks
  - [ ] Consumo accettabile

- [ ] **Batteria**:
  - [ ] Consumo ragionevole

- [ ] **Compatibilità**:
  - [ ] Test su Android 5.0 (API 21)
  - [ ] Test su Android 14 (API 34)
  - [ ] Test su iOS 13.0
  - [ ] Test su iOS 17

- [ ] **Orientamento**:
  - [ ] Portrait funzionante
  - [ ] Landscape (se supportato)

- [ ] **Tablet** (se supportato):
  - [ ] Layout adattato
  - [ ] Tutte le funzionalità

---

## 📦 Pre-Submission (DA FARE)

### Build Finali

- [ ] **Android App Bundle (.aab)**:
  - [ ] Build generato con successo
  - [ ] Firma verificata
  - [ ] Dimensione ottimizzata
  - [ ] File salvato: `build/app/outputs/bundle/release/app-release.aab`

- [ ] **iOS IPA**:
  - [ ] Build generato con successo
  - [ ] Firma verificata
  - [ ] Upload a App Store Connect (via Xcode o Transporter)

### Version Control

- [ ] Tutti i file committati (eccetto key.properties e keystore!)
- [ ] Tag versione creato: `v1.0.0`
- [ ] Push su repository GitHub

### Release Notes

- [ ] **Prima versione (esempio)**:
  ```
  🎉 Prima release di Quiz Patente B C CE!
  
  ✨ Funzionalità:
  • 7000+ quiz ministeriali per Patente B, C, CE
  • Teoria completa con 30 capitoli
  • Simulazioni esame realistiche
  • Supporto multilingua
  • Statistiche dettagliate
  • Modalità offline
  
  Buono studio e buona fortuna con l'esame! 🚗
  ```

---

## 🚀 Pubblicazione (DA FARE)

### Google Play Console

- [ ] **Creare account developer** ($25 una tantum)
- [ ] **Creare nuova app**
- [ ] **Upload App Bundle** (.aab)
- [ ] **Completare store listing**:
  - [ ] Titolo e descrizioni
  - [ ] Screenshot
  - [ ] Icona e feature graphic
  - [ ] Categorizzazione
  - [ ] Contatti e privacy policy
- [ ] **Configurare pricing** (gratuito/a pagamento)
- [ ] **Configurare paesi distribuzione**
- [ ] **Rating contenuto** (questionario)
- [ ] **Inviare per revisione**

Tempo stabile approvazione: 1-3 giorni

### App Store Connect

- [ ] **Account Apple Developer** ($99/anno)
- [ ] **Creare nuovo record app**
- [ ] **Upload build** (via Xcode o Transporter)
- [ ] **Completare store listing**:
  - [ ] Nome e descrizioni
  - [ ] Screenshot
  - [ ] Icona
  - [ ] Categorie
  - [ ] Privacy policy
- [ ] **Configurare pricing**
- [ ] **Configurare territori**
- [ ] **Age rating**
- [ ] **Inviare per revisione**

Tempo stimato approvazione: 24-48 ore

---

## 📊 Post-Pubblicazione (FUTURO)

### Monitoraggio

- [ ] Setup Firebase Analytics dashboards
- [ ] Monitorare crash reports
- [ ] Seguire recensioni utenti
- [ ] Analizzare metriche chiave (retention, engagement)

### Marketing

- [ ] Condividere link store
- [ ] Social media announcement
- [ ] Email a mailing list (se presente)

### Miglioramenti

- [ ] Raccogliere feedback utenti
- [ ] Pianificare aggiornamenti futuri
- [ ] Fix bug segnalati

---

## 📚 Risorse e Guide

### Documentazione Creata

- [x] `ANDROID_RELEASE_SIGNING.md` - Guida completa keystore
- [x] `STORE_LISTINGS.md` - Template descrizioni store
- [x] `PRIVACY_POLICY.md` - Template privacy policy

### Link Utili

**Android:**
- Google Play Console: https://play.google.com/console
- Release checklist: https://developer.android.com/studio/publish
- App signing: https://developer.android.com/studio/publish/app-signing

**iOS:**
- App Store Connect: https://appstoreconnect.apple.com
- Submit guidelines: https://developer.apple.com/app-store/review/guidelines/
- TestFlight: https://developer.apple.com/testflight/

**Firebase:**
- Console: https://console.firebase.google.com
- Documentation: https://firebase.google.com/docs

---

## ⚠️ Note Importanti

### Sicurezza

- **MAI committare** su Git:
  - key.properties
  - *.jks / *.keystore
  - google-services.json con chiavi sensitive
  - GoogleService-Info.plist con chiavi sensitive

- **Salvare in backup sicuro**:
  - Keystore file
  - Password keystore e chiavi
  - Certificati iOS

### Timeline Stimata

- **Setup e configurazione**: 2-4 ore
- **Creazione assets (icone, screenshot)**: 3-6 ore
- **Test completi**: 4-8 ore
- **Documentazione e privacy**: 2-3 ore
- **Prima submission**: 1-2 ore
- **Revisione store**: 1-3 giorni (Android), 1-2 giorni (iOS)

**Totale stimato**: 3-5 giorni di lavoro + tempo revisione

### Costi

- **Google Play Developer**: $25 (una tantum)
- **Apple Developer Program**: $99/anno
- **Totale primo anno**: $124

---

## ✅ Prossimi Step Immediati

1. [ ] Generare keystore Android
2. [ ] Configurare key.properties
3. [ ] Aggiornare build.gradle.kts per signing
4. [ ] Fare test build release Android
5. [ ] Creare icone app (512x512 e varie dimensioni)
6. [ ] Fare screenshot dell'app
7. [ ] Pubblicare privacy policy online
8. [ ] Completare store listings
9. [ ] Test finale su dispositivi reali
10. [ ] Submit a store!

---

**Stato Attuale**: ⏳ Configurazione base completata, pronto per Android signing setup

**Prossimo Milestone**: 🔐 Completare Android Release Signing

---

Ultimo aggiornamento: 27 Dicembre 2025  
Versione App: 1.0.0+1

