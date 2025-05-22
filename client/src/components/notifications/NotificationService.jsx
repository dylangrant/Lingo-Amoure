import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getTierInfo } from "@/lib/utils";
import { addDays, addHours, format, isPast, isFuture } from "date-fns";

// Create a context for notifications
const NotificationContext = createContext(null);

// Define the provider component
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    reminderTimes: {
      quick: 1, // hours before
      medium: 12, // hours before
      special: 24, // hours before
      grand: 48, // hours before
    }
  });
  const { toast } = useToast();
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("lovelingoNotifications");
    const savedSettings = localStorage.getItem("lovelingoNotificationSettings");
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Check for due notifications every minute
    const intervalId = setInterval(checkDueNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lovelingoNotifications", JSON.stringify(notifications));
    
    // Check for unread notifications
    const unread = notifications.filter(n => !n.read).length;
    if (unread > 0) {
      document.title = `(${unread}) LoveLingo`;
    } else {
      document.title = "LoveLingo";
    }
  }, [notifications]);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("lovelingoNotificationSettings", JSON.stringify(settings));
  }, [settings]);
  
  // Check for notifications that are due to be shown
  const checkDueNotifications = () => {
    if (!settings.enabled) return;
    
    const now = new Date();
    const dueNotifications = notifications.filter(
      n => !n.shown && !n.read && isPast(new Date(n.dueAt))
    );
    
    if (dueNotifications.length > 0) {
      // Mark notifications as shown
      const updatedNotifications = notifications.map(n => {
        if (dueNotifications.some(dn => dn.id === n.id)) {
          return { ...n, shown: true };
        }
        return n;
      });
      
      setNotifications(updatedNotifications);
      
      // Show toast for the most recent due notification
      const mostRecent = dueNotifications.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0];
      
      toast({
        title: mostRecent.title,
        description: mostRecent.message,
        duration: 10000,
      });
    }
  };
  
  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
      shown: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    return newNotification;
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId 
          ? { ...n, read: true } 
          : n
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };
  
  // Schedule a notification for an action
  const scheduleActionNotification = (action) => {
    if (!settings.enabled) return;
    
    const scheduledDate = new Date(action.scheduledDate);
    const { effortText } = getTierInfo(action.tier);
    const tierKey = action.tier.toLowerCase();
    
    // Calculate due time based on tier
    const hoursBefore = settings.reminderTimes[tierKey] || 24;
    const dueAt = addHours(scheduledDate, -hoursBefore).toISOString();
    
    // Create the notification
    const notification = {
      title: `Reminder: ${action.title}`,
      message: `Don't forget your ${effortText} action "${action.title}" scheduled for ${format(scheduledDate, "MMMM d 'at' h:mm a")}`,
      type: "reminder",
      actionId: action.id,
      dueAt,
      priority: action.tier === "grand" ? "high" : action.tier === "special" ? "medium" : "normal"
    };
    
    return addNotification(notification);
  };
  
  // Send a notification when an action is completed
  const sendCompletionNotification = (action) => {
    if (!settings.enabled) return;
    
    const { effortText } = getTierInfo(action.tier);
    const notification = {
      title: "Action Completed",
      message: `You completed the ${effortText} action "${action.title}"`,
      type: "success",
      actionId: action.id,
      dueAt: new Date().toISOString(), // Show immediately
      priority: "normal"
    };
    
    const newNotification = addNotification(notification);
    
    toast({
      title: notification.title,
      description: notification.message,
    });
    
    return newNotification;
  };
  
  // Send a feedback notification
  const sendFeedbackNotification = (action, feedback) => {
    if (!settings.enabled) return;
    
    const message = feedback.positive 
      ? `Your loved one really appreciated "${action.title}"! They gave it ${feedback.rating} stars.`
      : `Your action "${action.title}" could have gone better. They gave it ${feedback.rating} stars.`;
    
    const notification = {
      title: "Feedback Received",
      message,
      type: feedback.positive ? "success" : "info",
      actionId: action.id,
      dueAt: new Date().toISOString(), // Show immediately
      priority: "high"
    };
    
    return addNotification(notification);
  };
  
  // Update notification settings
  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };
  
  // Calculate the number of unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Define the context value
  const contextValue = {
    notifications,
    settings,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    scheduleActionNotification,
    sendCompletionNotification,
    sendFeedbackNotification,
    updateSettings
  };
  
  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

// Custom hook for using the notification context
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}