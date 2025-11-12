#!/bin/bash

echo "======================================"
echo "🔍 VERIFYING TRADUZIONE IN MEMORIA"
echo "======================================"
echo ""

# Check file existence
echo "📁 Checking files..."
echo ""

files=(
  "src/hooks/useLoadTranslationsFromFirebase.ts"
  "src/components/translation/ClickableText.tsx"
  "src/store/useStore.ts"
  "src/App.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (MISSING)"
  fi
done

echo ""
echo "======================================"
echo "🔎 Checking content..."
echo ""

# Check useStore has translationsCache
if grep -q "translationsCache:" src/store/useStore.ts; then
  echo "✅ useStore.ts has translationsCache"
else
  echo "❌ useStore.ts MISSING translationsCache"
fi

# Check useStore has getTranslation
if grep -q "getTranslation:" src/store/useStore.ts; then
  echo "✅ useStore.ts has getTranslation method"
else
  echo "❌ useStore.ts MISSING getTranslation method"
fi

# Check App.tsx imports hook
if grep -q "useLoadTranslationsFromFirebase" src/App.tsx; then
  echo "✅ App.tsx imports useLoadTranslationsFromFirebase"
else
  echo "❌ App.tsx MISSING import"
fi

# Check ClickableText exists
if grep -q "const ClickableText" src/components/translation/ClickableText.tsx; then
  echo "✅ ClickableText.tsx is properly defined"
else
  echo "❌ ClickableText.tsx MISSING component definition"
fi

echo ""
echo "======================================"
echo "📊 Line counts..."
echo ""

echo "useLoadTranslationsFromFirebase.ts: $(wc -l < src/hooks/useLoadTranslationsFromFirebase.ts) lines"
echo "ClickableText.tsx: $(wc -l < src/components/translation/ClickableText.tsx) lines"

echo ""
echo "======================================"
echo "✨ Setup verification complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. npm run dev"
echo "2. Check console for: ✅ Traduzioni caricate in memoria"
echo "3. Follow INTEGRATION_GUIDE.md for component integration"
echo ""

