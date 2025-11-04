import { FC, useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Trophy } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export const NotificationCenter: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Carica notifiche da localStorage
    const stored = localStorage.getItem('patente_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    }

    // Listener per nuove notifiche
    const handleNewNotification = (event: CustomEvent<Notification>) => {
      setNotifications(prev => {
        const updated = [event.detail, ...prev].slice(0, 50); // Max 50 notifiche
        localStorage.setItem('patente_notifications', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('new-notification' as any, handleNewNotification);
    return () => {
      window.removeEventListener('new-notification' as any, handleNewNotification);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('patente_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('patente_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('patente_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('patente_notifications');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Ora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m fa`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h fa`;
    const days = Math.floor(hours / 24);
    return `${days}g fa`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Notifiche</h3>
              {notifications.length > 0 && (
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      Segna tutte
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Cancella
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60">Nessuna notifica</p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-white/5 transition-colors ${
                        !notification.read ? 'bg-white/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="font-semibold text-white text-sm">
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="flex-shrink-0 text-white/50 hover:text-white/80"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/50">
                              {getTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Helper per creare notifiche
export const createNotification = (
  type: Notification['type'],
  title: string,
  message: string
) => {
  const notification: Notification = {
    id: `notif-${Date.now()}-${Math.random()}`,
    type,
    title,
    message,
    timestamp: Date.now(),
    read: false
  };

  window.dispatchEvent(
    new CustomEvent('new-notification', { detail: notification })
  );
};

