import { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/hooks/use-toast";
import { Bell } from "lucide-react";
import { format } from "date-fns";

// Create context for notification service
const NotificationContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationContext);
}

// Notification types
export const NOTIFICATION_TYPES = {
  ACTION_REMINDER: "action_reminder",
  ACTION_COMPLETED: "action_completed",
  ACTION_DUE_SOON: "action_due_soon",
  NEW_RECOMMENDATION: "new_recommendation",
};

export function NotificationProvider({ children }) {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("lovelingoNotifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
        
        // Count unread notifications
        const unread = parsed.filter(notification => !notification.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    }
    
    // Setup notification system
    setupNotificationSystem();
  }, []);

  // Setup browser notifications if enabled
  const setupNotificationSystem = () => {
    // Check for notification settings
    const settingsString = localStorage.getItem("lovelingoNotificationSettings");
    if (!settingsString) return;
    
    try {
      const settings = JSON.parse(settingsString);
      
      // Request permission for browser notifications if enabled
      if (settings.enabled && settings.pushEnabled) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
          Notification.requestPermission();
        }
      }
    } catch (error) {
      console.error("Error setting up notification system:", error);
    }
  };

  // Check for scheduled actions and show notifications
  useEffect(() => {
    // This would normally be done on the server side
    // This is a client-side simulation for demo purposes
    const checkScheduledActions = () => {
      const settings = getNotificationSettings();
      if (!settings || !settings.enabled) return;
      
      const scheduledActions = getScheduledActions();
      if (!scheduledActions || scheduledActions.length === 0) return;
      
      const now = new Date();
      
      // Filter to actions that are due today or tomorrow
      const upcomingActions = scheduledActions.filter(action => {
        if (action.completed) return false;
        
        const actionDate = new Date(action.scheduledDate);
        const diffTime = actionDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= 2 && diffDays >= 0;
      });
      
      // Send notifications for upcoming actions
      upcomingActions.forEach(action => {
        // Check if we've already notified for this action recently
        // In a real app, we'd check against a "last_notified" field in the database
        const notified = notifications.some(
          n => n.actionId === action.id && 
              new Date(n.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        );
        
        if (!notified) {
          const when = new Date(action.scheduledDate);
          const isToday = when.toDateString() === now.toDateString();
          
          addNotification({
            type: NOTIFICATION_TYPES.ACTION_REMINDER,
            title: isToday ? "Action Due Today" : "Action Due Tomorrow",
            message: action.title,
            actionId: action.id,
            actionData: action,
          });
        }
      });
    };
    
    // Check once on mount
    checkScheduledActions();
    
    // Then check periodically
    const interval = setInterval(checkScheduledActions, 60 * 60 * 1000); // every hour
    
    return () => clearInterval(interval);
  }, [notifications]);

  // Helper function to get notification settings
  const getNotificationSettings = () => {
    try {
      const settings = localStorage.getItem("lovelingoNotificationSettings");
      return settings ? JSON.parse(settings) : null;
    } catch (error) {
      console.error("Error getting notification settings:", error);
      return null;
    }
  };

  // Helper function to get scheduled actions
  const getScheduledActions = () => {
    try {
      const actions = localStorage.getItem("lovelingoScheduledActions");
      return actions ? JSON.parse(actions) : [];
    } catch (error) {
      console.error("Error getting scheduled actions:", error);
      return [];
    }
  };

  // Add a new notification
  const addNotification = async (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    
    // Update state and localStorage
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      localStorage.setItem("lovelingoNotifications", JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
      duration: 5000,
    });
    
    // Show browser notification if enabled
    showBrowserNotification(notification);
    
    // In a real app, we would also send email/SMS here
    await simulateExternalNotifications(notification);
  };

  // Show browser notification if enabled
  const showBrowserNotification = (notification) => {
    const settings = getNotificationSettings();
    if (!settings || !settings.enabled || !settings.pushEnabled) return;
    
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/favicon.ico"
      });
    }
  };

  // Simulate sending external notifications (email/SMS)
  const simulateExternalNotifications = async (notification) => {
    const settings = getNotificationSettings();
    if (!settings || !settings.enabled) return;
    
    // Log simulated notifications to console
    if (settings.emailEnabled && settings.email) {
      console.log(`[EMAIL NOTIFICATION] to ${settings.email}:`, notification);
    }
    
    if (settings.smsEnabled && settings.phoneNumber) {
      console.log(`[SMS NOTIFICATION] to ${settings.phoneNumber}:`, notification);
    }
    
    // In a real app, this would call an API endpoint to send the notifications
    return Promise.resolve();
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      );
      
      localStorage.setItem("lovelingoNotifications", JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(notification => ({ ...notification, read: true }));
      localStorage.setItem("lovelingoNotifications", JSON.stringify(updated));
      return updated;
    });
    
    setUnreadCount(0);
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("lovelingoNotifications");
  };

  // Manually trigger a notification for an action (used when scheduling)
  const scheduleActionNotification = (action) => {
    const settings = getNotificationSettings();
    if (!settings || !settings.enabled) return;
    
    addNotification({
      type: NOTIFICATION_TYPES.ACTION_DUE_SOON,
      title: "Action Scheduled",
      message: `${action.title} scheduled for ${format(new Date(action.scheduledDate), "MMM d")}`,
      actionId: action.id,
      actionData: action,
    });
  };

  // Completion notification
  const sendCompletionNotification = (action) => {
    const settings = getNotificationSettings();
    if (!settings || !settings.enabled || !settings.notifyOnCompletion) return;
    
    addNotification({
      type: NOTIFICATION_TYPES.ACTION_COMPLETED,
      title: "Action Completed",
      message: `Great job completing: ${action.title}`,
      actionId: action.id,
      actionData: action,
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        scheduleActionNotification,
        sendCompletionNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// A simple notification icon that displays unread count
export function NotificationIndicator() {
  const { unreadCount, markAllAsRead } = useNotifications();
  
  return (
    <div className="relative" onClick={markAllAsRead}>
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
          {unreadCount > 9 ? "9+" : unreadCount}
        </div>
      )}
    </div>
  );
}