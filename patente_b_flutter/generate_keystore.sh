#!/bin/bash

# Script per generare keystore Android
# Esegui questo script per creare il tuo keystore di release

echo "🔐 Generazione Keystore Android per Quiz Patente 2026"
echo "====================================================="
echo ""
echo "Questo script ti guiderà nella creazione del keystore."
echo "ATTENZIONE: Salva le password che inserirai in un posto sicuro!"
echo ""

# Nome del keystore
KEYSTORE_NAME="upload-keystore.jks"
KEYSTORE_PATH="$HOME/$KEYSTORE_NAME"

echo "📦 Il keystore verrà creato in: $KEYSTORE_PATH"
echo ""

# Controllo se esiste già
if [ -f "$KEYSTORE_PATH" ]; then
    echo "⚠️  ATTENZIONE: Un keystore esiste già in $KEYSTORE_PATH"
    echo ""
    read -p "Vuoi sovrascriverlo? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Operazione annullata."
        exit 1
    fi
    echo "🗑️  Rimuovo il keystore esistente..."
    rm "$KEYSTORE_PATH"
fi

echo ""
echo "🚀 Avvio generazione keystore..."
echo ""
echo "Ti verranno chieste alcune informazioni:"
echo "  1. Password keystore (scegli una password sicura!)"
echo "  2. Password chiave (può essere uguale alla password keystore)"
echo "  3. Nome e Cognome (esempio: Mario Rossi)"
echo "  4. Unità organizzativa (esempio: Development)"
echo "  5. Organizzazione (esempio: Quiz Patente)"
echo "  6. Città (esempio: Milano)"
echo "  7. Provincia (esempio: MI)"
echo "  8. Codice paese (IT)"
echo ""
echo "---------------------------------------------------"
echo ""

# Esegui comando keytool
keytool -genkey -v \
    -keystore "$KEYSTORE_PATH" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -alias upload

# Verifica risultato
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Keystore creato con successo!"
    echo ""
    echo "📍 Posizione: $KEYSTORE_PATH"
    echo ""
    echo "⚠️  IMPORTANTE: CONSERVA QUESTO FILE E LA PASSWORD IN UN POSTO SICURO!"
    echo ""
    echo "---------------------------------------------------"
    echo "🔧 PROSSIMI PASSI:"
    echo ""
    echo "1. Crea il file android/key.properties con questo contenuto:"
    echo ""
    echo "   storePassword=LA_TUA_PASSWORD_KEYSTORE"
    echo "   keyPassword=LA_TUA_PASSWORD_CHIAVE"
    echo "   keyAlias=upload"
    echo "   storeFile=$KEYSTORE_PATH"
    echo ""
    echo "2. NON COMMITTARE key.properties su Git!"
    echo ""
    echo "3. Fai backup del keystore in un luogo sicuro"
    echo ""
    echo "4. Salva le password in un password manager"
    echo ""
    echo "---------------------------------------------------"
    echo ""
    
    # Chiedi se creare automaticamente key.properties
    read -p "Vuoi che crei automaticamente android/key.properties? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "📝 Creazione android/key.properties..."
        
        # Chiedi password
        read -sp "Inserisci password keystore: " STORE_PASS
        echo ""
        read -sp "Inserisci password chiave: " KEY_PASS
        echo ""
        
        # Crea file key.properties
        cat > android/key.properties <<EOF
storePassword=$STORE_PASS
keyPassword=$KEY_PASS
keyAlias=upload
storeFile=$KEYSTORE_PATH
EOF
        
        echo "✅ File android/key.properties creato!"
        echo ""
        echo "⚠️  RICORDA: NON committare questo file su Git!"
        echo ""
    fi
    
    echo "🎉 Setup completato! Ora puoi fare build release:"
    echo ""
    echo "   flutter build appbundle --release"
    echo ""
else
    echo ""
    echo "❌ Errore durante la creazione del keystore."
    echo "Controlla i messaggi di errore e riprova."
    exit 1
fi
