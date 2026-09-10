import { supabase } from './supabaseClient';
import { MOCK_NOTIFICATIONS } from './mockData';

export const notificationService = {
  // Fetch user notifications from Supabase
  fetchNotifications: async (userId) => {
    if (!userId) return MOCK_NOTIFICATIONS;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || 'info',
          is_read: n.is_read,
          read: n.is_read,
          created_at: n.created_at,
          time: new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
      }
    } catch (err) {
      console.warn('Supabase notifications fetch error, using local fallback:', err.message);
    }

    // Local Storage Cache Fallback
    const localKey = `ic_notifications_${userId}`;
    const cached = localStorage.getItem(localKey);
    return cached ? JSON.parse(cached) : MOCK_NOTIFICATIONS;
  },

  // Mark single notification as read in Supabase
  markAsRead: async (userId, notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    } catch (err) {
      console.warn('Mark notification read exception:', err.message);
    }
  },

  // Mark all notifications as read in Supabase
  markAllAsRead: async (userId) => {
    if (!userId) return;
    try {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
    } catch (err) {
      console.warn('Mark all notifications read exception:', err.message);
    }
  },

  // Subscribe to Supabase Realtime notifications channel
  subscribeToRealtime: (userId, onNewNotification) => {
    if (!userId) return null;

    try {
      const channel = supabase
        .channel(`public:notifications:user_${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.new) {
              const newNotif = {
                id: payload.new.id,
                title: payload.new.title,
                message: payload.new.message,
                type: payload.new.type || 'info',
                is_read: false,
                read: false,
                created_at: payload.new.created_at,
                time: 'Just now',
              };
              onNewNotification(newNotif);
            }
          }
        )
        .subscribe();

      return channel;
    } catch (err) {
      console.warn('Realtime subscription error:', err.message);
      return null;
    }
  },
};
