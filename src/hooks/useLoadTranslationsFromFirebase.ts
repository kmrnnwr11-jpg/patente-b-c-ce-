import { useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import { getQuestionTranslation } from '@/locales/quizTranslations';

/**
 * Hook per caricare le traduzioni da Firebase in memoria (Zustand) all'avvio app
 * Le traduzioni sono fetchate una sola volta e cachate localmente
 * Successivi click su parole fanno lookup istantaneo da memoria (0ms)
 */
export function useLoadTranslationsFromFirebase() {
  const { 
    setTranslationsCache, 
    isTranslationsCacheLoaded, 
    setIsTranslationsCacheLoaded 
  } = useStore();

  useEffect(() => {
    // Evita multiple fetch se già caricato
    if (isTranslationsCacheLoaded) {
      console.log('✅ Traduzioni già caricate in memoria');
      return;
    }

    const loadTranslations = async () => {
      try {
        console.log('🔄 Caricando traduzioni da Firebase...');

        // 1. Prova a fetchare da Firestore (se hai una collection di traduzioni)
        let firebaseTranslations: Record<string, Record<string, string>> = {};
        
        try {
          // Tenta di leggere dalla collection 'translations' o simile
          const snapshot = await getDocs(collection(db, 'translations'));
          
          if (snapshot.docs.length > 0) {
            console.log(`📚 Trovate ${snapshot.docs.length} traduzioni in Firestore`);
            
            snapshot.docs.forEach(doc => {
              const data = doc.data();
              const contextId = doc.id; // Es: questionId, chapterId
              
              firebaseTranslations[contextId] = {
                en: data.en || '',
                it: data.it || '',
                fr: data.fr || '',
                de: data.de || '',
                es: data.es || '',
                // Aggiungi altre lingue se presenti in Firebase
              };
            });
          }
        } catch (firestoreError) {
          console.warn('⚠️ Collection translations non trovata in Firestore, continuando...', firestoreError);
        }

        // 2. Carica anche dalle traduzioni statiche locali (quizTranslations.ts)
        // Questo integra le traduzioni pre-compilate locali con Firebase
        const localTranslations: Record<string, Record<string, string>> = {};
        
        // Esempio: pre-popola dalle traduzioni quiz statiche (prime 50 domande)
        for (let i = 1; i <= 50; i++) {
          const translation = getQuestionTranslation(i, 'en', `Question ${i}`);
          if (translation && translation !== `Question ${i}`) {
            localTranslations[i.toString()] = {
              en: translation,
              it: `Question ${i}`, // Placeholder
            };
          }
        }

        // 3. Merge Firebase + Local (Firebase ha priorità)
        const mergedTranslations = {
          ...localTranslations,
          ...firebaseTranslations,
        };

        console.log(
          `✅ Traduzioni caricate in memoria: ${Object.keys(mergedTranslations).length} items`,
          `(Firebase: ${Object.keys(firebaseTranslations).length}, Local: ${Object.keys(localTranslations).length})`
        );

        // 4. Salva in Zustand (memory cache)
        setTranslationsCache(mergedTranslations);
        setIsTranslationsCacheLoaded(true);

      } catch (error) {
        console.error('❌ Errore caricamento traduzioni:', error);
        // Fallback: almeno cariche le locali
        setIsTranslationsCacheLoaded(true);
      }
    };

    loadTranslations();
  }, [isTranslationsCacheLoaded, setTranslationsCache, setIsTranslationsCacheLoaded]);
}

