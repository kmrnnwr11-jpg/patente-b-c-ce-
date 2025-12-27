# 🔗 Guida Deep Linking

Questa guida spiega come testare e configurare i deep link per il sistema referral.

---

## Formati Supportati

| Tipo | Formato | Esempio |
|------|---------|---------|
| URL Scheme | `patenteapp://ref/CODE` | `patenteapp://ref/ABC123` |
| Universal Link | `https://patenteapp.com/ref/CODE` | `https://patenteapp.com/ref/ABC123` |

---

## Configurazione Completata

### ✅ Android

`android/app/src/main/AndroidManifest.xml`:
- Intent filter per `patenteapp://` scheme
- Intent filter per `https://patenteapp.com/ref/`

### ✅ iOS

`ios/Runner/Info.plist`:
- CFBundleURLSchemes con `patenteapp`
- FlutterDeepLinkingEnabled = true

---

## Test su Simulatore/Device

### Android

```bash
# Apri un link patenteapp://
adb shell am start -a android.intent.action.VIEW \
    -d "patenteapp://ref/ABC123" \
    com.example.patente_b_flutter

# Apri un universal link
adb shell am start -a android.intent.action.VIEW \
    -d "https://patenteapp.com/ref/ABC123"
```

### iOS

```bash
# Apri su simulatore
xcrun simctl openurl booted "patenteapp://ref/ABC123"
```

---

## Universal Links (Produzione)

Per i link `https://patenteapp.com` servono file di associazione:

### Android: assetlinks.json

Crea `/.well-known/assetlinks.json` sul tuo dominio:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.patente_b_flutter",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

Ottieni il fingerprint:
```bash
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

### iOS: apple-app-site-association

Crea `/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [{
      "appID": "TEAMID.com.example.patenteB",
      "paths": ["/ref/*"]
    }]
  }
}
```

---

## Come Funziona

1. **Creator condivide link**: `patenteapp://ref/ABC123`
2. **Utente clicca il link** → l'app si apre
3. **DeepLinkService** estrae il codice `ABC123`
4. **Codice validato** → salvato in `SharedPreferences`
5. **Durante registrazione** → codice applicato automaticamente
6. **20% sconto** al nuovo utente
7. **€6/mese** al creator per 12 mesi

---

## Debug

Aggiungi questo in `main.dart` per debug:

```dart
DeepLinkHandler(
  onDeepLink: (uri) {
    debugPrint('🔗 Deep link ricevuto: $uri');
  },
  child: MaterialApp(...),
)
```
