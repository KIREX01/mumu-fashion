import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/layout/Layout';
import { useNotifications } from '@/contexts/NotificationContext';
import { Loader2, Check, Bell, Settings, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

const Notifications = () => {
  const { user, isLoading } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    preferences, 
    updatePreferences 
  } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  return (
    <Layout>
      <div className="bg-secondary/30 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 md:flex md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">My Notifications</h1>
              <p className="text-muted-foreground mt-1">Stay updated with your orders and activity.</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {unreadCount > 0 && (
                <Button onClick={() => markAllAsRead()} variant="outline">
                  <Check className="mr-2 h-4 w-4" />
                  Mark all read
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                   <Filter className="h-4 w-4 text-muted-foreground" />
                   <span className="text-sm font-medium">Filter:</span>
                </div>
                <Select value={filter} onValueChange={(v: 'all' | 'unread') => setFilter(v)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Notifications</SelectItem>
                    <SelectItem value="unread">Unread Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredNotifications.length === 0 ? (
                <Card>
                   <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Bell className="h-12 w-12 mb-4 opacity-20" />
                      <p>No notifications found matching your filter.</p>
                   </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNotifications.map((notif) => (
                    <Card 
                      key={notif.id} 
                      className={`transition-colors ${!notif.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                    >
                      <CardContent className="p-4 flex gap-4 items-start">
                        <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!notif.is_read ? 'bg-primary' : 'bg-transparent'}`} />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium leading-none">{notif.title}</p>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {notif.type.replace('_', ' ')}
                            </Badge>
                            {notif.link && (
                              <a 
                                href={notif.link} 
                                className="text-xs text-primary hover:underline"
                                onClick={(e) => {
                                  if (!notif.is_read) markAsRead(notif.id);
                                }}
                              >
                                View Details
                              </a>
                            )}
                          </div>
                        </div>
                        {!notif.is_read && (
                          <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 text-muted-foreground hover:text-foreground"
                             onClick={() => markAsRead(notif.id)}
                             title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Preferences
                  </CardTitle>
                  <CardDescription>
                    Customize your notification settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-page" className="flex flex-col gap-1">
                      <span>Sound</span>
                      <span className="font-normal text-xs text-muted-foreground">Play sound on new alerts</span>
                    </Label>
                    <Switch 
                      id="sound-page" 
                      checked={preferences.sound_enabled}
                      onCheckedChange={(checked) => updatePreferences({ sound_enabled: checked })}
                    />
                  </div>
                  {/* For now, users only have sound preference because other prefs are admin-specific in DB */}
                  <p className="text-xs text-muted-foreground italic">
                    More preferences coming soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
