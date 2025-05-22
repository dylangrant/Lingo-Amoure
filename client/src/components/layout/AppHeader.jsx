import { useState, useEffect } from "react";
import { useAuth } from "../../App";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BellIcon, Settings, Home, Calendar, History } from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { useNotifications } from "@/components/notifications/NotificationService";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppHeader() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const isMobile = useIsMobile();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="bg-primary text-primary-foreground px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">LoveLingo</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {!isMobile && (
            <nav className="flex items-center gap-2 mr-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-1 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/actions">
                  <Calendar className="mr-1 h-4 w-4" />
                  Actions
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/history">
                  <History className="mr-1 h-4 w-4" />
                  History
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="mr-1 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>
          )}
          
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative"
            >
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full" 
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
            
            {isNotificationsOpen && (
              <NotificationDropdown onClose={() => setIsNotificationsOpen(false)} />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline-block">Hello, {user?.name || "Friend"}</span>
            <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
          </div>
        </div>
      </div>
      
      {isMobile && (
        <nav className="flex justify-around items-center mt-2 pb-1">
          <Button variant="ghost" size="sm" asChild className="flex flex-col items-center">
            <Link href="/">
              <Home className="h-4 w-4 mb-1" />
              <span className="text-xs">Home</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="flex flex-col items-center">
            <Link href="/actions">
              <Calendar className="h-4 w-4 mb-1" />
              <span className="text-xs">Actions</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="flex flex-col items-center">
            <Link href="/history">
              <History className="h-4 w-4 mb-1" />
              <span className="text-xs">History</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="flex flex-col items-center">
            <Link href="/settings">
              <Settings className="h-4 w-4 mb-1" />
              <span className="text-xs">Settings</span>
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}