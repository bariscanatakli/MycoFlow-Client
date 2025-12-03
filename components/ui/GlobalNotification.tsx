'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  duration?: number;
}

interface NotificationContextType {
  notify: (message: string, type?: 'info' | 'success' | 'warning', duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    // Return a no-op function if used outside provider
    return { notify: () => {} };
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      
      {/* Global Notification Display - Fixed at top right */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`
              pointer-events-auto
              px-4 py-3 rounded-lg shadow-lg backdrop-blur-md
              animate-in slide-in-from-right-5 fade-in duration-300
              ${notification.type === 'info' ? 'bg-primary/90 text-white' : ''}
              ${notification.type === 'success' ? 'bg-green-500/90 text-white' : ''}
              ${notification.type === 'warning' ? 'bg-accent/90 text-white' : ''}
            `}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {notification.type === 'info' && '💡'}
                {notification.type === 'success' && '✅'}
                {notification.type === 'warning' && '🌿'}
              </span>
              <span className="font-medium text-sm">{notification.message}</span>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
