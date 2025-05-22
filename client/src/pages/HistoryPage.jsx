import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import LoginScreen from '@/components/auth/LoginScreen';
import { useToast } from '@/hooks/use-toast';
import { formatDate, getLoveLanguageColor, getLoveLanguageIcon } from '@/lib/utils';
import { MoreVertical, Check, Trash } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export default function HistoryPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  
  // Fetch scheduled actions
  const { data: scheduledActions, isLoading: isLoadingActions } = useQuery({
    queryKey: ['/api/scheduled-actions'],
    enabled: isAuthenticated,
  });
  
  // Complete an action
  const completeMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest('PATCH', `/api/scheduled-actions/${id}/complete`, {});
    },
    onSuccess: () => {
      toast({
        title: "Action completed",
        description: "Great job! Keep up the good work.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scheduled-actions'] });
    }
  });
  
  // Delete a scheduled action
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest('DELETE', `/api/scheduled-actions/${id}`, {});
    },
    onSuccess: () => {
      toast({
        title: "Action removed",
        description: "The action has been removed from your schedule",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/scheduled-actions'] });
    }
  });
  
  const handleComplete = (id) => {
    completeMutation.mutate(id);
  };
  
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };
  
  const getFilteredActions = () => {
    if (!scheduledActions) return [];
    
    if (activeTab === 'upcoming') {
      return scheduledActions.filter(sa => !sa.completed);
    } else {
      return scheduledActions.filter(sa => sa.completed);
    }
  };
  
  // If still loading auth state, return nothing (prevent flash)
  if (isLoading) {
    return null;
  }
  
  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }
  
  const filteredActions = getFilteredActions();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Sidebar />
      
      <main className="flex-grow pb-16 sm:pb-0 sm:pl-64">
        <div className="py-6">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold font-poppins text-neutral-dark mb-6">Action History</h2>
            
            <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <Card className="rounded-xl shadow-sm overflow-hidden">
                  {isLoadingActions ? (
                    <CardContent className="divide-y divide-gray-100">
                      <div className="p-4">
                        <Skeleton className="h-10 w-10 rounded-full float-left mr-3" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28 mt-2" />
                      </div>
                      <div className="p-4">
                        <Skeleton className="h-10 w-10 rounded-full float-left mr-3" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28 mt-2" />
                      </div>
                      <div className="p-4">
                        <Skeleton className="h-10 w-10 rounded-full float-left mr-3" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-28 mt-2" />
                      </div>
                    </CardContent>
                  ) : filteredActions.length > 0 ? (
                    <CardContent className="p-0 divide-y divide-gray-100">
                      {filteredActions.map(scheduledAction => {
                        const action = scheduledAction.action;
                        const iconClass = getLoveLanguageColor(action.loveLanguage);
                        const iconName = getLoveLanguageIcon(action.loveLanguage);
                        
                        return (
                          <div key={scheduledAction.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`${iconClass} rounded-full w-10 h-10 flex items-center justify-center mr-3`}>
                                <span className="material-icons text-white text-sm">{iconName}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-neutral-dark">{action.description}</h3>
                                <p className="text-sm text-neutral-medium">
                                  {formatDate(scheduledAction.scheduledDate)} • {action.loveLanguage}
                                </p>
                              </div>
                            </div>
                            {activeTab === 'upcoming' && (
                              <DropdownMenu
                                open={isActionMenuOpen === scheduledAction.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setIsActionMenuOpen(scheduledAction.id);
                                  } else {
                                    setIsActionMenuOpen(null);
                                  }
                                }}
                              >
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="rounded-full hover:bg-gray-100"
                                  >
                                    <MoreVertical className="h-5 w-5 text-neutral-medium" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleComplete(scheduledAction.id)}
                                    className="cursor-pointer"
                                  >
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Complete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(scheduledAction.id)}
                                    className="cursor-pointer"
                                  >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Remove
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  ) : (
                    <CardContent className="py-10 text-center">
                      <p className="text-neutral-medium mb-2">
                        {activeTab === 'upcoming' 
                          ? "No upcoming actions scheduled." 
                          : "No completed actions yet."}
                      </p>
                      {activeTab === 'upcoming' && (
                        <Button 
                          className="bg-primary hover:bg-primary-dark"
                          asChild
                        >
                          <a href="/actions">Add some actions</a>
                        </Button>
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
