# Guida Configurazione Release Signing Android

## Obiettivo
Configurare la firma digitale per il build release Android, necessaria per pubblicare l'app su Google Play Store.

## Step 1: Generare Keystore

### Comando per generare keystore

Esegui questo comando nel terminale (dalla root del progetto Flutter):

```bash
keytool -genkey -v -keystore ~/upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

### Informazioni da fornire

Durante la generazione, ti verranno richieste queste informazioni:

1. **Password keystore**: Scegli una password sicura e **conservala**
2. **Password chiave**: Può essere uguale alla password keystore
3. **Nome e Cognome**: Il tuo nome o nome azienda
4. **Unità organizzativa**: es. "Development"
5. **Organizzazione**: es. "Patente App" o nome tua azienda
6. **Città**: La tua città
7. **Provincia**: La tua provincia (sigla a 2 lettere)
8. **Codice paese**: IT

### Esempio output:

```
Enter keystore password: ********
Re-enter new password: ********
What is your first and last name?
  [Unknown]:  Mario Rossi
What is the name of your organizational unit?
  [Unknown]:  Development
What is the name of your organization?
  [Unknown]:  Patente App
What is the name of your City or Locality?
  [Unknown]:  Milano
What is the name of your State or Province?
  [Unknown]:  MI
What is the two-letter country code for this unit?
  [Unknown]:  IT
Is CN=Mario Rossi, OU=Development, O=Patente App, L=Milano, ST=MI, C=IT correct?
  [no]:  yes
```

**⚠️ IMPORTANTE**: 
- **Conserva il file `upload-keystore.jks` in un posto sicuro**
- **Non condividerlo mai pubblicamente**
- **Non commitarlo su Git**
- **Salva la password in un password manager sicuro**

Se perdi questo file o la password, non potrai più aggiornare la tua app su Play Store!

## Step 2: Creare file key.properties

Crea un file chiamato `key.properties` nella cartella `android/`:

```bash
cd android
touch key.properties
```

Aggiungi questo contenuto (sostituisci con i tuoi valori):

```properties
storePassword=<password-del-keystore>
keyPassword=<password-della-chiave>
keyAlias=upload
storeFile=<percorso-al-file-jks>
```

### Esempio:

```properties
storePassword=MiaPasswordSicura123!
keyPassword=MiaPasswordSicura123!
keyAlias=upload
storeFile=/Users/tuonome/upload-keystore.jks
```

**⚠️ NON COMMETTERE `key.properties` SU GIT!**

Verifica che sia già in `.gitignore`:

```bash
# Verifica che sia presente in android/.gitignore
cat android/.gitignore | grep key.properties
```

## Step 3: Aggiornare build.gradle.kts

Il file `android/app/build.gradle.kts` deve essere aggiornato per utilizzare il keystore.

### Prima del blocco `android {}`

Aggiungi questo codice all'inizio del file:

```kotlin
// Load keystore properties
val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = java.util.Properties()

if (keystorePropertiesFile.exists()) {
    keystorePropertiesFile.inputStream().use { stream ->
        keystoreProperties.load(stream)
    }
}
```

### Dentro il blocco `android {}`

Prima del blocco `buildTypes`, aggiungi:

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

### Aggiorna buildTypes:

```kotlin
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            // Enable code shrinking and obfuscation
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
```

## Step 4: Creare ProGuard rules (opzionale ma consigliato)

Crea il file `android/app/proguard-rules.pro`:

```proguard
# Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Preserve annotations and signatures
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
```

## Step 5: Test Build Release

### Build APK

```bash
cd /Users/kmrnnwr/PATENTE-B-2.0-2/patente_b_flutter
flutter build apk --release
```

### Build App Bundle (per Play Store)

```bash
flutter build appbundle --release
```

L'App Bundle verrà creato in:
`build/app/outputs/bundle/release/app-release.aab`

## Step 6: Verifica Firma

Verifica che l'APK/AAB sia firmato correttamente:

```bash
# Per APK
jarsigner -verify -verbose -certs build/app/outputs/flutter-apk/app-release.apk

# Per App Bundle
jarsigner -verify -verbose -certs build/app/outputs/bundle/release/app-release.aab
```

Dovresti vedere: `jar verified.`

## Troubleshooting

### Errore: "keystore not found"
- Verifica che il percorso in `storeFile` sia corretto
- Usa percorso assoluto invece di relativo

### Errore: "Incorrect password"
- Verifica password in `key.properties`
- Assicurati di non avere spazi extra

### Errore: "minifyEnabled requires...
- Assicurati di aver creato `proguard-rules.pro`
- Oppure rimuovi `isMinifyEnabled = true`

## Checklist Finale

Prima di pubblicare su Play Store:

- [ ] Keystore generato e salvato al sicuro
- [ ] `key.properties` creato e configurato
- [ ] `key.properties` aggiunto a `.gitignore`
- [ ] `build.gradle.kts` aggiornato con signing config
- [ ] Build release testato con successo
- [ ] App Bundle (`.aab`) generato correttamente
- [ ] Firma verificata con `jarsigner`
- [ ] Password salvate in password manager sicuro
- [ ] Backup del keystore in luogo sicuro

## File da Conservare OFFLINE

**⚠️ CRITICO - Conserva questi file in modo sicuro:**

1. `upload-keystore.jks` - Il keystore file
2. `key.properties` - Le password (o in password manager)
3. Documento con:
   - Password keystore
   - Password chiave
   - Alias chiave
   - Informazioni utilizzate nella generazione

**Suggerimento**: Salva una copia criptata su un cloud storage privato e un'altra su un disco esterno.

