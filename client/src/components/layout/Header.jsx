import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Settings, User } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();
  const { toast } = useToast();

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

  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "Notification features coming soon!",
    });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <span className="material-icons text-primary text-2xl cursor-pointer">favorite</span>
          </Link>
          <h1 className="text-xl font-semibold font-poppins">LoveLingo</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-medium hover:text-primary rounded-full"
            onClick={handleNotificationClick}
          >
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="w-8 h-8 cursor-pointer">
                <AvatarImage src={user?.profileImageUrl} alt="Profile" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings">
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <a href="/api/logout">
                  <div className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
