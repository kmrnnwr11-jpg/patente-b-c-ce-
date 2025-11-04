import { FC, useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, Trophy } from 'lucide-react';
import { GlassCard } from './GlassCard';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const STORAGE_KEY = 'patente_notifications';

export const NotificationCenter: FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const saveNotifications = (notifs: Notification[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
      setNotifications(notifs);
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Adesso';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m fa`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h fa`;
    return `${Math.floor(seconds / 86400)}g fa`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
      >
        <Bell className="w-6 h-6 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
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
          <GlassCard className="absolute right-0 top-12 w-96 max-h-[600px] overflow-hidden z-50 animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-white">
                  Notifiche
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
              
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Segna tutte lette
                  </button>
                  <span className="text-white/30">•</span>
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Cancella tutte
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[500px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70">Nessuna notifica</p>
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
                      <div className="flex items-start gap-3">
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
                              className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            >
                              <X className="w-4 h-4 text-white/50" />
                            </button>
                          </div>
                          <p className="text-white/70 text-sm mb-2">
                            {notification.message}
                          </p>
                          <span className="text-xs text-white/50">
                            {getTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};

// Hook per aggiungere notifiche
export const useNotifications = () => {
  const addNotification = (
    type: Notification['type'],
    title: string,
    message: string
  ) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const notifications: Notification[] = saved ? JSON.parse(saved) : [];
      
      const newNotification: Notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        timestamp: new Date(),
        read: false
      };

      const updated = [newNotification, ...notifications].slice(0, 50); // Max 50 notifiche
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Trigger custom event per aggiornare UI
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  return { addNotification };
};

