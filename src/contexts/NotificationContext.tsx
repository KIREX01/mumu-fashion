import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

// Notification sound URL
const SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3';


export type NotificationType = 'new_user' | 'order_placed' | 'payment_failed';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminPreferences {
  notify_new_user: boolean;
  notify_order_placed: boolean;
  notify_payment_failed: boolean;
  sound_enabled: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  preferences: AdminPreferences;
  updatePreferences: (prefs: Partial<AdminPreferences>) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<AdminPreferences>({
    notify_new_user: true,
    notify_order_placed: true,
    notify_payment_failed: true,
    sound_enabled: true,
  });
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(SOUND_URL);
  }, []);

  const playSound = () => {
    if (preferences.sound_enabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) {
      setNotifications(data as Notification[]);
    }
  };

  const fetchPreferences = async () => {
    if (!user || !isAdmin) return;
    const { data } = await supabase
      .from('admin_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data) {
      setPreferences({
        notify_new_user: data.notify_new_user,
        notify_order_placed: data.notify_order_placed,
        notify_payment_failed: data.notify_payment_failed,
        sound_enabled: data.sound_enabled,
      });
    } else {
        // Initialize if not exists
        await supabase.from('admin_preferences').insert({ user_id: user.id });
    }
  };

  useEffect(() => {
    if (!user) return;

    fetchNotifications();
    if (isAdmin) {
      fetchPreferences();
    }

    // Subscribe to realtime changes
    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
          playSound();
          toast({
            title: newNotif.title,
            description: newNotif.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, user, preferences.sound_enabled]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    if (!user) return;
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id);
  };

  const updatePreferences = async (newPrefs: Partial<AdminPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
    if (!user) return;
    
    // Only save to DB if admin, otherwise keep in local state for session
    if (isAdmin) {
        const { error } = await supabase
        .from('admin_preferences')
        .upsert({ user_id: user.id, ...newPrefs });
        
        if (error) {
        console.error('Error saving preferences', error);
        }
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      preferences,
      updatePreferences
    }}>
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
