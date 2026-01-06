import { useState } from 'react';
import { Bell, Check, Settings, Trash2 } from 'lucide-react';
import { useNotifications, Notification } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, preferences, updatePreferences } = useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = (notif: Notification) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      setOpen(false);
      navigate(notif.link);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-background animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Tabs defaultValue="notifications" className="w-full">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <h4 className="font-semibold">Notifications</h4>
            <TabsList className="h-8">
              <TabsTrigger value="notifications" className="h-6 text-xs">List</TabsTrigger>
              <TabsTrigger value="settings" className="h-6 text-xs"><Settings className="h-3 w-3" /></TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="notifications" className="m-0">
            <div className="px-4 py-2 border-b flex justify-between items-center bg-secondary/20">
              <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-xs text-primary hover:underline flex items-center"
                >
                  <Check className="h-3 w-3 mr-1" /> Mark all read
                </button>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No notifications
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`text-left p-4 border-b last:border-0 hover:bg-secondary/50 transition-colors ${
                        !notif.is_read ? 'bg-secondary/10' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm line-clamp-1">{notif.title}</span>
                        {!notif.is_read && <span className="h-2 w-2 rounded-full bg-blue-500 mt-1" />}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {notif.message}
                      </p>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-[10px] h-5 px-1 capitalize">
                          {notif.type.replace('_', ' ')}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="m-0 p-4 space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound" className="flex flex-col gap-1">
                  <span>Sound</span>
                  <span className="font-normal text-xs text-muted-foreground">Play sound on new alerts</span>
                </Label>
                <Switch 
                  id="sound" 
                  checked={preferences.sound_enabled}
                  onCheckedChange={(checked) => updatePreferences({ sound_enabled: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="new-user" className="flex flex-col gap-1">
                  <span>New Users</span>
                  <span className="font-normal text-xs text-muted-foreground">Notify when user joins</span>
                </Label>
                <Switch 
                  id="new-user" 
                  checked={preferences.notify_new_user}
                  onCheckedChange={(checked) => updatePreferences({ notify_new_user: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="orders" className="flex flex-col gap-1">
                  <span>Orders</span>
                  <span className="font-normal text-xs text-muted-foreground">Notify on new orders</span>
                </Label>
                <Switch 
                  id="orders" 
                  checked={preferences.notify_order_placed}
                  onCheckedChange={(checked) => updatePreferences({ notify_order_placed: checked })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};
