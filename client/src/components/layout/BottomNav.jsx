import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: 'home', label: 'Home' },
  { path: '/actions', icon: 'favorite', label: 'Actions' },
  { path: '/actions/add', icon: 'add_circle', label: 'Add' },
  { path: '/history', icon: 'history', label: 'History' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-lg border-t border-gray-200 fixed bottom-0 inset-x-0 z-30 sm:hidden">
      <div className="flex justify-around">
        {navItems.map(item => (
          <Link key={item.path} href={item.path}>
            <a className={cn(
              "flex flex-col items-center justify-center w-full py-2",
              location === item.path ? "text-primary" : "text-neutral-medium hover:text-primary"
            )}>
              <span className="material-icons">{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}
