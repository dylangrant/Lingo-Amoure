import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { createClient, Provider } from 'urql';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import { useState } from "react";
import { AppStateProvider } from "./context/AppStateContext";

// Pages
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import QuizPage from "@/pages/QuizPage";
import SettingsPage from "@/pages/SettingsPage";
import ActionsPage from "@/pages/ActionsPage";
import HistoryPage from "@/pages/HistoryPage";
import LoginScreen from "@/components/auth/LoginScreen";

// Create simple client or use a dummy placeholder until we fully implement GraphQL
const urqlClient = {
  executeQuery: () => Promise.resolve({ data: {} }),
  executeMutation: () => Promise.resolve({ data: {} }),
  executeSubscription: () => ({ unsubscribe: () => {} })
};

function Router() {
  const [authenticated, setAuthenticated] = useState(false);

  // Simple temporary auth check
  const isAuthenticated = authenticated;

  return (
    <Switch>
      <Route path="/" component={() => isAuthenticated ? <HomePage /> : <LoginScreen />} />
      <Route path="/quiz" component={() => isAuthenticated ? <QuizPage /> : <LoginScreen />} />
      <Route path="/settings" component={() => isAuthenticated ? <SettingsPage /> : <LoginScreen />} />
      <Route path="/actions" component={() => isAuthenticated ? <ActionsPage /> : <LoginScreen />} />
      <Route path="/history" component={() => isAuthenticated ? <HistoryPage /> : <LoginScreen />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider value={urqlClient}>
        <AppStateProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AppStateProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
