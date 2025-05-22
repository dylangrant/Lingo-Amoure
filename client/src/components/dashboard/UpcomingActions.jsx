import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreVertical, Calendar } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatDate, getLoveLanguageColor, getLoveLanguageIcon } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function UpcomingActions() {
  const { toast } = useToast();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(null);
  
  // Fetch scheduled actions
  const { data: scheduledActions, isLoading } = useQuery({
    queryKey: ['/api/scheduled-actions'],
    queryFn: async () => {
      const res = await fetch('/api/scheduled-actions', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch scheduled actions');
      return res.json();
    }
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
  
  // Filter upcoming (not completed) actions
  const upcomingActions = scheduledActions?.filter(sa => !sa.completed) || [];
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-poppins text-neutral-dark">Upcoming Actions</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary-dark"
          asChild
        >
          <Link href="/actions">
            <Calendar className="h-4 w-4 mr-1" />
            <span>View All</span>
          </Link>
        </Button>
      </div>
      
      <Card className="rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
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
          </CardContent>
        ) : upcomingActions.length > 0 ? (
          <CardContent className="p-0 divide-y divide-gray-100">
            {upcomingActions.slice(0, 3).map(scheduledAction => {
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
                      <DropdownMenuItem onClick={() => handleComplete(scheduledAction.id)}>
                        Mark as Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(scheduledAction.id)}>
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })}
          </CardContent>
        ) : (
          <CardContent>
            <div className="py-6 text-center">
              <p className="text-neutral-medium">No upcoming actions scheduled.</p>
              <Button
                variant="link"
                className="mt-2"
                asChild
              >
                <Link href="/actions">Add some actions</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
