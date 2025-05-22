import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import UserProfile from './UserProfile';

const navItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/actions', icon: 'favorite', label: 'Actions' },
  { path: '/actions/add', icon: 'add_circle', label: 'Add Action' },
  { path: '/history', icon: 'history', label: 'History' },
  { path: '/quiz', icon: 'quiz', label: 'Love Language Quiz' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <div className="hidden sm:block fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg">
      <div className="p-4 border-b border-gray-200">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <span className="material-icons text-primary text-2xl">favorite</span>
            <h1 className="text-xl font-semibold font-poppins">LoveLingo</h1>
          </div>
        </Link>
      </div>
      
      <div className="py-4">
        <ul>
          {navItems.map(item => (
            <li key={item.path}>
              <Link href={item.path}>
                <a className={cn(
                  "flex items-center px-4 py-3",
                  location === item.path 
                    ? "text-primary bg-primary bg-opacity-10" 
                    : "text-neutral-medium hover:bg-gray-100"
                )}>
                  <span className="material-icons mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 p-4 border-t border-gray-200">
        <UserProfile />
      </div>
    </div>
  );
}
