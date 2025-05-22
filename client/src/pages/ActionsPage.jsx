import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { useAppState } from '@/context/AppStateContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import ActionCard from '@/components/dashboard/ActionCard';
import AddCustomAction from '@/components/actions/AddCustomAction';
import LoginScreen from '@/components/auth/LoginScreen';
import { useToast } from '@/hooks/use-toast';
import { LOVE_LANGUAGE_OPTIONS } from '@/constants/loveLanguages';

export default function ActionsPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredActions, setFilteredActions] = useState([]);
  
  // Fetch all actions
  const { data: actions, isLoading: isLoadingActions } = useQuery({
    queryKey: ['/api/actions'],
    enabled: isAuthenticated,
  });
  
  // Schedule an action
  const scheduleMutation = useMutation({
    mutationFn: async (actionId) => {
      // Schedule for today
      const scheduledDate = new Date();
      return apiRequest('POST', '/api/scheduled-actions', { 
        actionId, 
        scheduledDate: scheduledDate.toISOString() 
      });
    },
    onSuccess: () => {
      toast({
        title: "Action scheduled",
        description: "The action has been added to your schedule",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scheduled-actions'] });
    }
  });
  
  // Rate an action (like/dislike)
  const rateMutation = useMutation({
    mutationFn: async ({ id, likeStatus }) => {
      return apiRequest('PATCH', `/api/actions/${id}/rate`, { likeStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/actions'] });
    }
  });
  
  // Filter actions when tab changes
  useEffect(() => {
    if (!actions) return;
    
    if (activeTab === 'all') {
      setFilteredActions(actions);
    } else {
      setFilteredActions(actions.filter(action => action.loveLanguage === activeTab));
    }
  }, [activeTab, actions]);
  
  const handleSchedule = (actionId) => {
    scheduleMutation.mutate(actionId);
  };
  
  const handleRate = (id, likeStatus) => {
    rateMutation.mutate({ id, likeStatus });
  };
  
  // If still loading auth state, return nothing (prevent flash)
  if (isLoading) {
    return null;
  }
  
  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Sidebar />
      
      <main className="flex-grow pb-16 sm:pb-0 sm:pl-64">
        <div className="py-6">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold font-poppins text-neutral-dark mb-6">Actions</h2>
            
            <div className="mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {LOVE_LANGUAGE_OPTIONS.map(option => (
                    <TabsTrigger key={option.value} value={option.value}>
                      {option.label.split(' ')[0]}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <TabsContent value={activeTab}>
                  {isLoadingActions ? (
                    <div className="space-y-4">
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-40 w-full" />
                      <Skeleton className="h-40 w-full" />
                    </div>
                  ) : filteredActions && filteredActions.length > 0 ? (
                    filteredActions.map(action => (
                      <ActionCard
                        key={action.id}
                        action={action}
                        onSchedule={handleSchedule}
                        onRate={handleRate}
                      />
                    ))
                  ) : (
                    <Card className="rounded-xl shadow-sm">
                      <CardContent className="p-6 text-center">
                        <p className="text-neutral-medium mb-2">No actions found for this filter.</p>
                        <Button
                          className="bg-primary hover:bg-primary-dark"
                          asChild
                        >
                          <a href="#add-action">Add Custom Action</a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div id="add-action">
              <AddCustomAction />
            </div>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
