import { useAuth } from "../../App";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function AppHeader() {
  const { user, logout } = useAuth();
  
  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">LoveLingo</h1>
        <nav className="hidden md:flex gap-4">
          <Button variant="link" className="text-primary-foreground p-0" asChild>
            <Link href="/">Dashboard</Link>
          </Button>
          <Button variant="link" className="text-primary-foreground p-0" asChild>
            <Link href="/actions">Actions</Link>
          </Button>
          <Button variant="link" className="text-primary-foreground p-0" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <span className="hidden md:inline">{user?.name || "User"}</span>
        <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
      </div>
    </header>
  );
}