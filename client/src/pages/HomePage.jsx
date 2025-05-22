import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { useAppState } from '@/context/AppStateContext';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Dashboard from '@/components/dashboard/Dashboard';
import LoginScreen from '@/components/auth/LoginScreen';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { dispatch } = useAppState();
  
  // Fetch notification settings to initialize app state
  const { data: settings } = useQuery({
    queryKey: ['/api/notification-settings'],
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Initialize app state with user data
  useEffect(() => {
    if (user && user.primaryLoveLanguage) {
      dispatch({
        type: 'SET_PARTNER_LOVE_LANGUAGE',
        payload: user.primaryLoveLanguage
      });
    }
  }, [user, dispatch]);
  
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
        <Dashboard />
      </main>
      
      <BottomNav />
    </div>
  );
}
