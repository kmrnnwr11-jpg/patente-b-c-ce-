import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

/**
 * Hook personalizzato per gestire la lingua dell'applicazione
 * Include supporto per cambio lingua e Web Speech API multi-lingua
 */
export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  
  const currentLanguage = i18n.language || 'it';
  
  /**
   * Cambia la lingua dell'applicazione
   * @param lang Codice lingua ('it', 'en', etc.)
   */
  const changeLanguage = async (lang: string) => {
    try {
      await i18n.changeLanguage(lang);
      localStorage.setItem('language', lang);
      
      // Aggiorna l'attributo lang del documento HTML per accessibilità
      document.documentElement.lang = lang;
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };
  
  // Mappa della lingua per Web Speech API
  const speechLanguageMap: Record<string, string> = {
    'it': 'it-IT',
    'it-IT': 'it-IT',
    'en': 'en-US',
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'es': 'es-ES'
  };
  
  /**
   * Ottiene il codice lingua per Web Speech API
   * @returns Codice lingua per Speech Synthesis (es. 'it-IT', 'en-US')
   */
  const getSpeechLanguage = (): string => {
    return speechLanguageMap[currentLanguage] || speechLanguageMap[currentLanguage.split('-')[0]] || 'it-IT';
  };
  
  /**
   * Verifica se la voce per la lingua corrente è disponibile
   * @returns true se la voce è disponibile
   */
  const isSpeechAvailable = (): boolean => {
    if (!('speechSynthesis' in window)) {
      return false;
    }
    
    const voices = window.speechSynthesis.getVoices();
    const targetLang = getSpeechLanguage();
    
    return voices.some(voice => voice.lang.startsWith(targetLang.split('-')[0]));
  };
  
  /**
   * Ottiene la migliore voce disponibile per la lingua corrente
   * @returns La voce migliore o undefined se non disponibile
   */
  const getBestVoice = (): SpeechSynthesisVoice | undefined => {
    if (!('speechSynthesis' in window)) {
      return undefined;
    }
    
    const voices = window.speechSynthesis.getVoices();
    const targetLang = getSpeechLanguage();
    const langPrefix = targetLang.split('-')[0];
    
    // Cerca prima una voce esatta
    let voice = voices.find(v => v.lang === targetLang);
    
    // Poi cerca per prefisso lingua
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(langPrefix));
    }
    
    // Preferisci voci locali se disponibili
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(langPrefix) && v.localService);
    }
    
    return voice;
  };
  
  /**
   * Speak text usando la lingua corrente
   * @param text Testo da pronunciare
   * @param onStart Callback quando inizia a parlare
   * @param onEnd Callback quando finisce di parlare
   * @param onError Callback in caso di errore
   */
  const speak = (
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: any) => void
  ) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech Synthesis not supported');
      onError?.(new Error('Speech Synthesis not supported'));
      return;
    }
    
    // Ferma eventuali letture precedenti
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getSpeechLanguage();
    utterance.rate = 0.9; // Velocità leggermente ridotta per chiarezza
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Imposta la voce migliore
    const voice = getBestVoice();
    if (voice) {
      utterance.voice = voice;
    }
    
    // Event handlers
    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = (event) => onError(event);
    
    window.speechSynthesis.speak(utterance);
  };
  
  /**
   * Ferma la lettura corrente
   */
  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  
  // Effetto per caricare le voci quando disponibili
  useEffect(() => {
    if ('speechSynthesis' in window) {
      // Le voci potrebbero non essere immediatamente disponibili
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      
      // Evento che si attiva quando le voci sono caricate
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);
  
  // Effetto per impostare l'attributo lang del documento
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);
  
  return {
    currentLanguage,
    changeLanguage,
    getSpeechLanguage,
    isSpeechAvailable,
    getBestVoice,
    speak,
    stopSpeaking,
    t
  };
};


