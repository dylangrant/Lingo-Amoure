import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function LoginScreen() {
  const { toast } = useToast();

  const handleLogin = (provider) => {
    // For now, all providers just redirect to Replit auth
    window.location.href = '/api/login';
  };

  useEffect(() => {
    // Check if we have an error in the URL (from a failed login attempt)
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    
    if (error) {
      toast({
        title: "Authentication failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [toast]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-secondary-light h-64 md:h-80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
        <div className="container mx-auto px-4 py-16 relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white font-poppins">LoveLingo</h1>
            <p className="text-white text-lg mt-2 max-w-md">Remember the little things that make love grow.</p>
          </div>
        </div>
      </div>
      
      {/* Auth Container */}
      <div className="container mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-primary-light rounded-full mb-4">
              <span className="material-icons text-white text-3xl animate-heart">favorite</span>
            </div>
            <h2 className="text-2xl font-semibold text-neutral-dark font-poppins">Welcome to LoveLingo</h2>
            <p className="text-neutral-medium mt-2">Strengthen your relationship with thoughtful actions based on the 5 love languages</p>
          </div>
          
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-3"
              onClick={() => handleLogin('google')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" className="w-5 h-5" />
              Continue with Google
            </Button>
            
            <Button 
              className="w-full bg-[#3b5998] hover:bg-[#324b81] flex items-center justify-center gap-3"
              onClick={() => handleLogin('facebook')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Facebook_icon_2013.svg" alt="Facebook logo" className="w-5 h-5" />
              Continue with Facebook
            </Button>
            
            <Button 
              className="w-full bg-black hover:bg-gray-800 flex items-center justify-center gap-3"
              onClick={() => handleLogin('apple')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple logo" className="w-5 h-5 invert" />
              Continue with Apple
            </Button>
            
            <Button 
              className="w-full bg-[#00a1f1] hover:bg-[#008ad3] flex items-center justify-center gap-3"
              onClick={() => handleLogin('microsoft')}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft logo" className="w-5 h-5" />
              Continue with Microsoft
            </Button>
          </div>
          
          <div className="mt-6 text-center text-sm text-neutral-medium">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <span className="material-icons text-primary mr-3">favorite</span>
              <div className="text-left">
                <h3 className="font-medium">Words of Affirmation</h3>
                <p className="text-sm text-neutral-medium">Express appreciation verbally</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <span className="material-icons text-primary mr-3">card_giftcard</span>
              <div className="text-left">
                <h3 className="font-medium">Receiving Gifts</h3>
                <p className="text-sm text-neutral-medium">Thoughtful presents matter</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
              <span className="material-icons text-primary mr-3">schedule</span>
              <div className="text-left">
                <h3 className="font-medium">Quality Time</h3>
                <p className="text-sm text-neutral-medium">Undivided attention counts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
