import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_NOTIFICATIONS } from '../services/mockData';
import internshipService from '../services/internshipService';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read && !n.is_read).length;

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, is_read: true } : n))
    );
    internshipService.markNotificationAsRead(id);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true, is_read: true })));
  };

  const addNotification = (notif) => {
    setNotifications((prev) => [
      {
        id: notif.id || `notif_${Date.now()}`,
        title: notif.title || 'Notification',
        message: notif.message,
        type: notif.type || 'info',
        read: false,
        is_read: false,
        time: 'Just now',
      },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isDrawerOpen,
        toggleDrawer,
        closeDrawer,
        markAsRead,
        markAllAsRead,
        addNotification,
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

