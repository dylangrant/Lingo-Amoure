import { useEffect, useRef } from "react";
import { useNotifications } from "./NotificationService";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Calendar, AlertCircle, HelpCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export function NotificationDropdown({ onClose }) {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    unreadCount 
  } = useNotifications();
  
  const dropdownRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  // Get notification icon based on type
  const getNotificationIcon = (type, priority) => {
    switch (type) {
      case "reminder":
        return <Calendar className={`h-4 w-4 ${priority === "high" ? "text-destructive" : "text-muted-foreground"}`} />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "info":
        return <HelpCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  // Get time text for notifications
  const getTimeText = (dateStr) => {
    const date = new Date(dateStr);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  
  // Handle notification click
  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };
  
  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-card border z-50"
    >
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center">
          <Bell className="mr-2 h-4 w-4" />
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Badge className="ml-2" variant="secondary">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="mr-1 h-4 w-4" />
          Mark all read
        </Button>
      </div>
      
      <ScrollArea className="h-[300px]">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="py-1">
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`px-4 py-3 hover:bg-accent cursor-pointer border-b last:border-b-0 transition-colors ${
                  !notification.read ? "bg-muted/40" : ""
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  <div className="ml-2 flex-1">
                    <div className="flex justify-between">
                      <p className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                        {notification.title}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {getTimeText(notification.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t">
        <Button 
          variant="link" 
          size="sm" 
          asChild
          className="w-full justify-center"
          onClick={onClose}
        >
          <a href="/settings#notifications">Manage notification settings</a>
        </Button>
      </div>
    </div>
  );
}