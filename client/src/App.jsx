import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { createContext, useState, useContext } from "react";
import { AppStateProvider } from "./context/AppStateContext";

// Pages
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import QuizPage from "@/pages/QuizPage";
import SettingsPage from "@/pages/SettingsPage";
import ActionsPage from "@/pages/ActionsPage";
import HistoryPage from "@/pages/HistoryPage";
import LoginPage from "./pages/LoginPage";

// Create Auth Context
const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

// Auth Provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useLocation();

  const login = (userData) => {
    setUser(userData);
    setLocation("/");
  };

  const logout = () => {
    setUser(null);
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProtectedRoute({ component: Component }) {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={() => <ProtectedRoute component={HomePage} />} />
      <Route path="/quiz" component={() => <ProtectedRoute component={QuizPage} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      <Route path="/actions" component={() => <ProtectedRoute component={ActionsPage} />} />
      <Route path="/history" component={() => <ProtectedRoute component={HistoryPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppStateProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppStateProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
