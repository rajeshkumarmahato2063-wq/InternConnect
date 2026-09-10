import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { useAuth } from './AuthContext';
import { MOCK_NOTIFICATIONS } from '../services/mockData';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState(null);

  const userId = user?.id || null;

  // Load existing notifications and setup Supabase Realtime channel
  useEffect(() => {
    let activeChannel = null;

    const loadAndSubscribe = async () => {
      if (userId) {
        const loaded = await notificationService.fetchNotifications(userId);
        if (loaded) setNotifications(loaded);

        // Subscribe to live Supabase Realtime notifications
        activeChannel = notificationService.subscribeToRealtime(userId, (newNotif) => {
          setNotifications((prev) => [newNotif, ...prev]);

          // Show realtime toast alert
          setToastNotification(newNotif);
          setTimeout(() => setToastNotification(null), 5000);
        });
      }
    };

    loadAndSubscribe();

    return () => {
      if (activeChannel) {
        activeChannel.unsubscribe();
      }
    };
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read && !n.is_read).length;

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n))
    );
    if (userId) {
      notificationService.markAsRead(userId, id);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
    if (userId) {
      notificationService.markAllAsRead(userId);
    }
  };

  const addNotification = (notif) => {
    const newNotif = {
      id: notif.id || `notif_${Date.now()}`,
      title: notif.title || 'Notification Alert',
      message: notif.message,
      type: notif.type || 'info',
      read: false,
      is_read: false,
      time: 'Just now',
      created_at: new Date().toISOString(),
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setToastNotification(newNotif);
    setTimeout(() => setToastNotification(null), 4000);
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        toastNotification,
        toggleDrawer,
        closeDrawer,
        markAsRead,
        markAllAsRead,
        addNotification,
        clearNotification,
        setToastNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
