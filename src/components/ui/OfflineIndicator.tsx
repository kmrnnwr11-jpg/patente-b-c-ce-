import { FC } from 'react';
import { WifiOff, Download } from 'lucide-react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export const OfflineIndicator: FC = () => {
  const { isOnline, isRegistered, needsUpdate, updateServiceWorker } = useServiceWorker();

  // Show update notification
  if (needsUpdate) {
    return (
      <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-4 shadow-2xl border border-blue-400/30 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Aggiornamento Disponibile</h4>
              <p className="text-sm text-white/90 mb-3">
                Una nuova versione dell'app è disponibile
              </p>
              <button
                onClick={updateServiceWorker}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Aggiorna Ora
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-slide-down">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-3 shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm">Modalità Offline</h4>
              <p className="text-xs text-white/90">
                {isRegistered 
                  ? 'Puoi continuare a usare l\'app offline' 
                  : 'Connessione non disponibile'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show online indicator (briefly)
  return null;
};

