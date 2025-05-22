import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ActionCard from './ActionCard';
import UpcomingActions from './UpcomingActions';
import AddCustomAction from '../actions/AddCustomAction';
import { useAppState } from '@/context/AppStateContext';

export default function Dashboard() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { state } = useAppState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch recommendations based on partner's love language
  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ['/api/recommendations', state.partnerLoveLanguage],
    queryFn: async () => {
      const url = `/api/recommendations?loveLanguage=${encodeURIComponent(state.partnerLoveLanguage || 'Acts of Service')}`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      return res.json();
    },
    enabled: !!state.partnerLoveLanguage
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
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
    }
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Recommendations refreshed",
        description: "We've found new suggestions for you",
      });
    } catch (error) {
      toast({
        title: "Error refreshing",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSchedule = (actionId) => {
    scheduleMutation.mutate(actionId);
  };

  const handleRate = (id, likeStatus) => {
    rateMutation.mutate({ id, likeStatus });
  };

  const getPartnerName = () => {
    return user?.partnerName || 'your partner';
  };

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Welcome Hero */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6">
              <h2 className="text-white text-2xl font-semibold font-poppins">
                Welcome back, {user?.firstName || 'there'}!
              </h2>
              <p className="text-white text-opacity-90 mt-1">
                Show love to {getPartnerName()} today through their primary language
              </p>
              <div className="mt-4 flex items-center">
                <span className="bg-white bg-opacity-20 py-1 px-3 rounded-full text-white text-sm">
                  <span className="material-icons text-sm align-middle mr-1">favorite</span>
                  {state.partnerLoveLanguage || 'Acts of Service'}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="material-icons text-white text-5xl">favorite</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold font-poppins text-neutral-dark">Today's Suggestions</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary-dark"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              <span>Refresh</span>
            </Button>
          </div>
          
          {isLoading ? (
            // Loading skeletons
            <div className="space-y-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            recommendations.map(action => (
              <ActionCard
                key={action.id}
                action={action}
                onSchedule={handleSchedule}
                onRate={handleRate}
              />
            ))
          ) : (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm">
              <p className="text-neutral-medium">No recommendations available.</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={handleRefresh}
              >
                Try refreshing
              </Button>
            </div>
          )}
        </div>
        
        {/* Upcoming Actions */}
        <UpcomingActions />
        
        {/* Add Custom Action */}
        <AddCustomAction />
      </div>
    </div>
  );
}
