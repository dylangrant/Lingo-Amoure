import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useAppState } from '@/context/AppStateContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { LOVE_LANGUAGE_OPTIONS } from '@/constants/loveLanguages';
import { Edit } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

// Validation schema for profile form
const profileSchema = z.object({
  partnerName: z.string().min(1, 'Partner name is required'),
  primaryLoveLanguage: z.string().min(1, 'Primary love language is required'),
});

// Validation schema for notification settings
const notificationSchema = z.object({
  emailEnabled: z.boolean(),
  pushEnabled: z.boolean(),
  smsEnabled: z.boolean(),
  phoneNumber: z.string().nullable().optional(),
  quickActionInterval: z.string(),
  mediumActionInterval: z.string(),
  specialActionInterval: z.string(),
  grandActionInterval: z.string(),
});

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { state, dispatch } = useAppState();
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isNotificationSaving, setIsNotificationSaving] = useState(false);
  
  // Fetch notification settings
  const { data: notificationSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/notification-settings'],
    queryFn: async () => {
      const res = await fetch('/api/notification-settings', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch notification settings');
      return res.json();
    }
  });
  
  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      partnerName: user?.partnerName || '',
      primaryLoveLanguage: user?.primaryLoveLanguage || '',
    },
  });
  
  // Notification settings form
  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailEnabled: true,
      pushEnabled: true,
      smsEnabled: false,
      phoneNumber: '',
      quickActionInterval: 'Every 1-5 days (Default)',
      mediumActionInterval: 'Every 6-14 days (Default)',
      specialActionInterval: 'Every 15-30 days (Default)',
      grandActionInterval: 'Every 31+ days (Default)',
    },
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('PATCH', '/api/users/profile', data);
    },
    onSuccess: (data) => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      // Update app state
      if (data.json.primaryLoveLanguage) {
        dispatch({ 
          type: 'SET_PARTNER_LOVE_LANGUAGE', 
          payload: data.json.primaryLoveLanguage 
        });
      }
      
      // Invalidate user query
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProfileSaving(false);
    }
  });
  
  // Update notification settings mutation
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: async (data) => {
      return apiRequest('POST', '/api/notification-settings', data);
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your notification settings have been updated",
      });
      
      // Invalidate notification settings query
      queryClient.invalidateQueries({ queryKey: ['/api/notification-settings'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsNotificationSaving(false);
    }
  });
  
  // Update form defaults when user data is loaded
  useEffect(() => {
    if (user) {
      profileForm.reset({
        partnerName: user.partnerName || '',
        primaryLoveLanguage: user.primaryLoveLanguage || '',
      });
    }
  }, [user, profileForm]);
  
  // Update form defaults when notification settings are loaded
  useEffect(() => {
    if (notificationSettings) {
      notificationForm.reset({
        emailEnabled: notificationSettings.emailEnabled,
        pushEnabled: notificationSettings.pushEnabled,
        smsEnabled: notificationSettings.smsEnabled,
        phoneNumber: notificationSettings.phoneNumber || '',
        quickActionInterval: `Every ${notificationSettings.quickActionInterval.min}-${notificationSettings.quickActionInterval.max} days (Default)`,
        mediumActionInterval: `Every ${notificationSettings.mediumActionInterval.min}-${notificationSettings.mediumActionInterval.max} days (Default)`,
        specialActionInterval: `Every ${notificationSettings.specialActionInterval.min}-${notificationSettings.specialActionInterval.max} days (Default)`,
        grandActionInterval: `Every ${notificationSettings.grandActionInterval.min}+ days (Default)`,
      });
    }
  }, [notificationSettings, notificationForm]);
  
  const onProfileSubmit = (data) => {
    setIsProfileSaving(true);
    updateProfileMutation.mutate(data);
  };
  
  const onNotificationSubmit = (data) => {
    setIsNotificationSaving(true);
    
    // Parse interval ranges from strings
    const parseIntervalString = (str) => {
      const matches = str.match(/Every (\d+)-(\d+)|Every (\d+)\+/);
      if (matches) {
        if (matches[3]) {
          return { min: parseInt(matches[3]), max: 90 };
        } else {
          return { min: parseInt(matches[1]), max: parseInt(matches[2]) };
        }
      }
      return { min: 1, max: 5 }; // Default
    };
    
    const settings = {
      emailEnabled: data.emailEnabled,
      pushEnabled: data.pushEnabled,
      smsEnabled: data.smsEnabled,
      phoneNumber: data.phoneNumber || null,
      quickActionInterval: parseIntervalString(data.quickActionInterval),
      mediumActionInterval: parseIntervalString(data.mediumActionInterval),
      specialActionInterval: parseIntervalString(data.specialActionInterval),
      grandActionInterval: parseIntervalString(data.grandActionInterval),
    };
    
    updateNotificationSettingsMutation.mutate(settings);
  };
  
  const getInitials = () => {
    if (!user) return 'G';
    
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else if (user.email) {
      return user.email[0].toUpperCase();
    } else {
      return 'U';
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold font-poppins text-neutral-dark mb-6">Settings</h2>
      
      {/* Profile Information */}
      <Card className="rounded-xl shadow-sm overflow-hidden mb-6">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium">Profile Information</h3>
          </div>
          
          {!user ? (
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-grow">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </div>
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.profileImageUrl} alt="Profile" />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <h4 className="font-medium">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.firstName || user.email}
                      </h4>
                      <p className="text-sm text-neutral-medium">{user.email}</p>
                    </div>
                    <div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-primary"
                        type="button"
                        disabled
                      >
                        <Edit className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="partnerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner's Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
                    name="primaryLoveLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partner's Primary Love Language</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select love language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOVE_LANGUAGE_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        <div className="mt-2">
                          <Button variant="link" className="text-primary p-0 h-auto" asChild>
                            <Link href="/quiz">Take Quiz Again</Link>
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-primary hover:bg-primary-dark"
                    disabled={isProfileSaving}
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      {/* Notification Settings */}
      <Card className="rounded-xl shadow-sm overflow-hidden mb-6">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium">Notification Settings</h3>
          </div>
          
          {isLoadingSettings ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                <div className="p-4 space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="emailEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium">Email Notifications</FormLabel>
                          <p className="text-sm text-neutral-medium">Receive action reminders via email</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="pushEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium">Push Notifications</FormLabel>
                          <p className="text-sm text-neutral-medium">Receive action reminders on your device</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="smsEnabled"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel className="font-medium">SMS Notifications</FormLabel>
                          <p className="text-sm text-neutral-medium">Receive action reminders via text message</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 123-4567" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      {/* Reminder Frequency */}
      <Card className="rounded-xl shadow-sm overflow-hidden mb-6">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-medium">Reminder Frequency</h3>
          </div>
          
          {isLoadingSettings ? (
            <div className="p-4 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <Form {...notificationForm}>
              <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)}>
                <div className="p-4 space-y-4">
                  <FormField
                    control={notificationForm.control}
                    name="quickActionInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quick & Easy Actions</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Every 1-5 days (Default)">Every 1-5 days (Default)</SelectItem>
                            <SelectItem value="Every 2-7 days">Every 2-7 days</SelectItem>
                            <SelectItem value="Every 3-10 days">Every 3-10 days</SelectItem>
                            <SelectItem value="Custom...">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="mediumActionInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medium Effort Actions</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Every 6-14 days (Default)">Every 6-14 days (Default)</SelectItem>
                            <SelectItem value="Every 10-20 days">Every 10-20 days</SelectItem>
                            <SelectItem value="Every 14-28 days">Every 14-28 days</SelectItem>
                            <SelectItem value="Custom...">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="specialActionInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Occasion Actions</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Every 15-30 days (Default)">Every 15-30 days (Default)</SelectItem>
                            <SelectItem value="Every 30-60 days">Every 30-60 days</SelectItem>
                            <SelectItem value="Every 45-90 days">Every 45-90 days</SelectItem>
                            <SelectItem value="Custom...">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={notificationForm.control}
                    name="grandActionInterval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grand Gesture Actions</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interval" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Every 31+ days (Default)">Every 31+ days (Default)</SelectItem>
                            <SelectItem value="Every 60-120 days">Every 60-120 days</SelectItem>
                            <SelectItem value="Every 90-180 days">Every 90-180 days</SelectItem>
                            <SelectItem value="Custom...">Custom...</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary-dark"
                    disabled={isNotificationSaving}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
