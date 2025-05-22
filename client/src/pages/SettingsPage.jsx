import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';
import Settings from '@/components/settings/Settings';
import LoginScreen from '@/components/auth/LoginScreen';

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
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
            <Settings />
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
