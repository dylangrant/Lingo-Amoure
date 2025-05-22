import { useState } from "react";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FaGoogle, FaFacebook, FaApple, FaMicrosoft } from "react-icons/fa";
import { getLoveLanguageColor } from "@/lib/utils";
import { LOVE_LANGUAGES } from "@/constants/loveLanguages";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Simulate login with a provider
  const handleLogin = (provider) => {
    setIsLoading(true);
    
    // Simulate a network request
    setTimeout(() => {
      // Mock user data
      const mockUser = {
        id: "user-123",
        name: "Demo User",
        email: "demo@example.com",
        provider
      };
      
      login(mockUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Welcome to LoveLingo</CardTitle>
            <CardDescription>
              Connect with your loved ones through meaningful actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => handleLogin("google")}
              disabled={isLoading}
            >
              <FaGoogle className="text-red-500" />
              <span>Continue with Google</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => handleLogin("facebook")}
              disabled={isLoading}
            >
              <FaFacebook className="text-blue-600" />
              <span>Continue with Facebook</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => handleLogin("apple")}
              disabled={isLoading}
            >
              <FaApple />
              <span>Continue with Apple</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2" 
              onClick={() => handleLogin("microsoft")}
              disabled={isLoading}
            >
              <FaMicrosoft className="text-blue-500" />
              <span>Continue with Microsoft</span>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </CardFooter>
        </Card>
      </div>
      
      {/* App Info */}
      <div className="flex-1 bg-gradient-to-br from-primary/90 to-primary p-6 text-primary-foreground flex flex-col justify-center hidden md:flex">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Love in Every Action</h1>
          <p className="text-lg mb-8">
            LoveLingo helps you understand and practice the 5 love languages to strengthen your relationships.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">The 5 Love Languages</h2>
          <div className="space-y-3">
            {Object.entries(LOVE_LANGUAGES).map(([key, name]) => (
              <div 
                key={key} 
                className="p-3 rounded-lg" 
                style={{ backgroundColor: getLoveLanguageColor(key) }}
              >
                <span className="font-medium">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}