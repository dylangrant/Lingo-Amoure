import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export default function UserProfile() {
  const { user } = useAuth();

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

  const getName = () => {
    if (!user) return 'Guest';
    
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user.firstName) {
      return user.firstName;
    } else if (user.email) {
      return user.email.split('@')[0];
    } else {
      return 'User';
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarImage src={user?.profileImageUrl} alt="Profile" />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <h4 className="font-medium">{getName()}</h4>
        <p className="text-xs text-neutral-medium truncate">{user?.email || 'guest@example.com'}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-neutral-medium hover:text-neutral-dark"
        asChild
      >
        <a href="/api/logout">
          <LogOut className="h-5 w-5" />
        </a>
      </Button>
    </div>
  );
}
