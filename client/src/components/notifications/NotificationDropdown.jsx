import { useState } from "react";
import { useNotifications } from "./NotificationService";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Bell, 
  Check, 
  Trash2, 
  Calendar, 
  Info,
  Clock, 
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearAllNotifications 
  } = useNotifications();

  // Format the notification timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    
    if (isToday(date)) {
      return `Today, ${format(date, "h:mm a")}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, "h:mm a")}`;
    } else {
      return format(date, "MMM d, h:mm a");
    }
  };

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "action_reminder":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "action_completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "action_due_soon":
        return <Clock className="h-5 w-5 text-orange-500" />;
      case "new_recommendation":
        return <Info className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          <div className="flex gap-1">
            {notifications.length > 0 && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 px-2"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearAllNotifications}
                  className="h-8 px-2"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer",
                    !notification.read && "bg-muted/20"
                  )}
                  onClick={() => {
                    markAsRead(notification.id);
                    // If it's an action notification, we could navigate to that action
                    if (notification.actionId) {
                      setOpen(false);
                    }
                  }}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className={cn("text-sm", !notification.read && "font-medium")}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="p-2">
          <Button 
            variant="ghost" 
            size="sm"
            asChild
            className="w-full justify-center"
          >
            <Link href="/settings">
              Notification Settings
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}