import { useState, useEffect } from "react";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { BellRing, Mail, MessageSquare, Bell, BellOff, Save, RotateCcw, Phone, Calendar } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ACTION_TIER_OPTIONS } from "@/constants/loveLanguages";
import { AppHeader } from "@/components/layout/AppHeader";

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("notifications");
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    emailEnabled: true,
    email: "",
    pushEnabled: true,
    smsEnabled: false,
    phoneNumber: "",
    
    // When to send notifications
    reminderTimes: {
      "Quick & Easy": { min: 1, max: 5 },
      "Medium Effort": { min: 6, max: 14 },
      "Special Occasion": { min: 15, max: 30 },
      "Grand Gesture": { min: 31, max: 90 }
    },
    
    // Custom time ranges for each action type
    customTimeRanges: false,
    
    // Morning reminders between 8am-10am
    morningReminders: true,
    
    // Advanced options
    notifyOnCompletion: true,
    weekendRemindersOnly: false,
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00"
    }
  });

  // Load saved settings from localStorage on initial load
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("lovelingoNotificationSettings");
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Error loading notification settings:", error);
    }
  }, []);

  // Handle form submission
  const handleSaveSettings = () => {
    try {
      // Save to localStorage (in a real app, would save to database)
      localStorage.setItem("lovelingoNotificationSettings", JSON.stringify(notificationSettings));
      
      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Failed to save settings",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Reset settings to default
  const handleResetSettings = () => {
    setNotificationSettings({
      enabled: true,
      emailEnabled: true,
      email: "",
      pushEnabled: true,
      smsEnabled: false,
      phoneNumber: "",
      
      reminderTimes: {
        "Quick & Easy": { min: 1, max: 5 },
        "Medium Effort": { min: 6, max: 14 },
        "Special Occasion": { min: 15, max: 30 },
        "Grand Gesture": { min: 31, max: 90 }
      },
      
      customTimeRanges: false,
      morningReminders: true,
      notifyOnCompletion: true,
      weekendRemindersOnly: false,
      quietHours: {
        enabled: false,
        start: "22:00",
        end: "08:00"
      }
    });
    
    toast({
      title: "Settings reset",
      description: "Notification settings have been reset to default values.",
    });
  };

  // Update a specific setting
  const updateSettings = (path, value) => {
    setNotificationSettings(prev => {
      // Create a deep copy of the previous state
      const newSettings = JSON.parse(JSON.stringify(prev));
      
      // Handle nested paths like "quietHours.enabled"
      if (path.includes('.')) {
        const [parent, child] = path.split('.');
        newSettings[parent][child] = value;
      } else {
        newSettings[path] = value;
      }
      
      return newSettings;
    });
  };

  // Update reminder time ranges
  const updateReminderTimeRange = (tier, range) => {
    setNotificationSettings(prev => {
      const newSettings = { ...prev };
      newSettings.reminderTimes[tier] = range;
      return newSettings;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader />

      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Settings</h2>
          <p className="text-muted-foreground mt-1">Configure your LoveLingo experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              orientation="vertical" 
              className="w-full"
            >
              <TabsList className="flex flex-col h-auto">
                <TabsTrigger value="notifications" className="justify-start">
                  <BellRing className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="account" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Preferences
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive action reminders
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Main toggle for all notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn all notifications on or off
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.enabled}
                      onCheckedChange={(checked) => updateSettings("enabled", checked)}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Notification channels - only visible if notifications are enabled */}
                  {notificationSettings.enabled && (
                    <>
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Channels</h3>
                        
                        {/* Email Notifications */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="email-notifications" 
                              checked={notificationSettings.emailEnabled}
                              onCheckedChange={(checked) => updateSettings("emailEnabled", checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="email-notifications" className="text-sm font-medium">
                                Email Notifications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive reminders via email
                              </p>
                            </div>
                          </div>
                          
                          {notificationSettings.emailEnabled && (
                            <div className="pl-6">
                              <Label htmlFor="email">Email Address</Label>
                              <Input 
                                id="email" 
                                placeholder="Enter your email address"
                                className="mt-1.5 w-full max-w-md"
                                value={notificationSettings.email}
                                onChange={(e) => updateSettings("email", e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* Push Notifications */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="push-notifications" 
                              checked={notificationSettings.pushEnabled}
                              onCheckedChange={(checked) => updateSettings("pushEnabled", checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="push-notifications" className="text-sm font-medium">
                                Browser Notifications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive reminders as browser notifications
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* SMS Notifications */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="sms-notifications" 
                              checked={notificationSettings.smsEnabled}
                              onCheckedChange={(checked) => updateSettings("smsEnabled", checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="sms-notifications" className="text-sm font-medium">
                                SMS Notifications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive reminders via text message
                              </p>
                            </div>
                          </div>
                          
                          {notificationSettings.smsEnabled && (
                            <div className="pl-6">
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input 
                                id="phone" 
                                placeholder="Enter your phone number"
                                className="mt-1.5 w-full max-w-md"
                                value={notificationSettings.phoneNumber}
                                onChange={(e) => updateSettings("phoneNumber", e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      {/* Advanced Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Advanced Settings</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="morning-reminders" 
                              checked={notificationSettings.morningReminders}
                              onCheckedChange={(checked) => updateSettings("morningReminders", checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="morning-reminders" className="text-sm font-medium">
                                Morning Reminders
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive reminders in the morning (8:00 AM - 10:00 AM)
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="notify-completion" 
                              checked={notificationSettings.notifyOnCompletion}
                              onCheckedChange={(checked) => updateSettings("notifyOnCompletion", checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="notify-completion" className="text-sm font-medium">
                                Completion Notifications
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Receive confirmation when actions are marked as completed
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="weekend-only" 
                              checked={notificationSettings.weekendRemindersOnly}
                              onCheckedChange={(checked) => updateSettings("weekendRemindersOnly", checked)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="weekend-only" className="text-sm font-medium">
                                Weekend Reminders Only
                              </Label>
                              <p className="text-sm text-muted-foreground">
                                Only send reminders on weekends (Saturday and Sunday)
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="quiet-hours" 
                                checked={notificationSettings.quietHours.enabled}
                                onCheckedChange={(checked) => updateSettings("quietHours.enabled", checked)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label htmlFor="quiet-hours" className="text-sm font-medium">
                                  Quiet Hours
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Don't send notifications during specific hours
                                </p>
                              </div>
                            </div>
                            
                            {notificationSettings.quietHours.enabled && (
                              <div className="pl-6 grid grid-cols-2 gap-4 mt-3">
                                <div className="space-y-2">
                                  <Label htmlFor="quiet-start">Start Time</Label>
                                  <Select
                                    value={notificationSettings.quietHours.start}
                                    onValueChange={(value) => {
                                      setNotificationSettings(prev => ({
                                        ...prev,
                                        quietHours: {
                                          ...prev.quietHours,
                                          start: value
                                        }
                                      }))
                                    }}
                                  >
                                    <SelectTrigger id="quiet-start">
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 24 }).map((_, i) => {
                                        const hour = i.toString().padStart(2, '0');
                                        return (
                                          <SelectItem key={hour} value={`${hour}:00`}>
                                            {`${hour}:00`}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>
                                
                                <div className="space-y-2">
                                  <Label htmlFor="quiet-end">End Time</Label>
                                  <Select
                                    value={notificationSettings.quietHours.end}
                                    onValueChange={(value) => {
                                      setNotificationSettings(prev => ({
                                        ...prev,
                                        quietHours: {
                                          ...prev.quietHours,
                                          end: value
                                        }
                                      }))
                                    }}
                                  >
                                    <SelectTrigger id="quiet-end">
                                      <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: 24 }).map((_, i) => {
                                        const hour = i.toString().padStart(2, '0');
                                        return (
                                          <SelectItem key={hour} value={`${hour}:00`}>
                                            {`${hour}:00`}
                                          </SelectItem>
                                        );
                                      })}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleResetSettings}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Schedule Preferences Tab */}
            <TabsContent value="account" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reminder Schedule Preferences</CardTitle>
                  <CardDescription>
                    Configure how often to receive reminders based on action type
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="custom-ranges" 
                      checked={notificationSettings.customTimeRanges}
                      onCheckedChange={(checked) => updateSettings("customTimeRanges", checked)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="custom-ranges" className="text-sm font-medium">
                        Use Custom Time Ranges
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Customize how frequently to receive reminders for each action tier
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-8 mt-4">
                    {ACTION_TIER_OPTIONS.map(tier => (
                      <div key={tier.value} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{tier.label}</h4>
                            <p className="text-xs text-muted-foreground">
                              {notificationSettings.reminderTimes[tier.value].min}-
                              {notificationSettings.reminderTimes[tier.value].max} days between reminders
                            </p>
                          </div>
                          {tier.value !== "Quick & Easy" && (
                            <Badge variant="outline" className={
                              tier.value === "Medium Effort" 
                                ? "bg-blue-100 text-blue-800" 
                                : tier.value === "Special Occasion" 
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-pink-100 text-pink-800"
                            }>
                              {tier.value}
                            </Badge>
                          )}
                        </div>
                        
                        {notificationSettings.customTimeRanges && (
                          <div className="pt-2 pb-6">
                            <div className="mb-6">
                              <Slider 
                                min={1}
                                max={
                                  tier.value === "Quick & Easy" ? 10 :
                                  tier.value === "Medium Effort" ? 30 :
                                  tier.value === "Special Occasion" ? 60 : 
                                  120
                                }
                                step={1}
                                value={[
                                  notificationSettings.reminderTimes[tier.value].min,
                                  notificationSettings.reminderTimes[tier.value].max
                                ]}
                                onValueChange={(value) => {
                                  updateReminderTimeRange(tier.value, {
                                    min: value[0],
                                    max: value[1]
                                  })
                                }}
                              />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>1 day</span>
                              <span>
                                {tier.value === "Quick & Easy" ? "10" :
                                tier.value === "Medium Effort" ? "30" :
                                tier.value === "Special Occasion" ? "60" : 
                                "120"} days
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={handleResetSettings}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button 
                    onClick={handleSaveSettings}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;