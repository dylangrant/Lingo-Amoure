import { useState } from "react";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarHeart, Gift, MessageSquareHeart, Clock, Settings, CalendarCheck2 } from "lucide-react";
import { LOVE_LANGUAGE_OPTIONS } from "@/constants/loveLanguages";
import { Link } from "wouter";
import LoveLanguageQuiz from "@/components/quiz/LoveLanguageQuiz";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [partner, setPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    primaryLoveLanguage: "",
    secondaryLoveLanguage: ""
  });
  const [activeTab, setActiveTab] = useState("manual");

  const handleAddPartner = (e) => {
    if (e) e.preventDefault();
    setPartner({
      id: "partner-1",
      name: newPartner.name,
      primaryLoveLanguage: newPartner.primaryLoveLanguage,
      secondaryLoveLanguage: newPartner.secondaryLoveLanguage
    });
    setShowAddPartner(false);
  };
  
  const handleQuizComplete = (results) => {
    setNewPartner({
      ...newPartner,
      primaryLoveLanguage: results.primary,
      secondaryLoveLanguage: results.secondary
    });
    setActiveTab("manual"); // Switch back to manual tab to review and save
  };

  const upcomingActions = [
    {
      id: 1,
      title: "Send a thoughtful text message",
      date: "Today",
      loveLanguage: "words_of_affirmation"
    },
    {
      id: 2,
      title: "Surprise coffee delivery",
      date: "Tomorrow",
      loveLanguage: "receiving_gifts"
    },
    {
      id: 3,
      title: "Plan weekend getaway",
      date: "Next Friday",
      loveLanguage: "quality_time"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">LoveLingo</h1>
        <div className="flex items-center gap-4">
          <span>Hello, {user?.name || "Friend"}</span>
          <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold">Welcome to LoveLingo</h2>
            
            {partner ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Your Partner</CardTitle>
                    <CardDescription>Manage your relationship information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-base">Name</Label>
                        <p className="text-xl font-medium">{partner.name}</p>
                      </div>
                      <div>
                        <Label className="text-base">Primary Love Language</Label>
                        <p className="text-xl font-medium">
                          {LOVE_LANGUAGE_OPTIONS.find(lang => lang.value === partner.primaryLoveLanguage)?.label || "Not set"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setNewPartner({
                          name: partner.name,
                          primaryLoveLanguage: partner.primaryLoveLanguage
                        });
                        setShowAddPartner(true);
                      }}
                    >
                      Edit Partner Info
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Actions</CardTitle>
                    <CardDescription>Scheduled expressions of love</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingActions.map(action => (
                        <div key={action.id} className="flex items-center gap-4 p-3 border rounded-lg">
                          <div className="bg-primary/10 p-2 rounded-full">
                            {action.loveLanguage === "words_of_affirmation" && <MessageSquareHeart className="h-5 w-5 text-primary" />}
                            {action.loveLanguage === "quality_time" && <Clock className="h-5 w-5 text-primary" />}
                            {action.loveLanguage === "receiving_gifts" && <Gift className="h-5 w-5 text-primary" />}
                            {action.loveLanguage === "acts_of_service" && <CalendarCheck2 className="h-5 w-5 text-primary" />}
                            {action.loveLanguage === "physical_touch" && <CalendarHeart className="h-5 w-5 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{action.title}</p>
                            <p className="text-sm text-muted-foreground">{action.date}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Complete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/actions">View All Actions</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                  <CardDescription>Add your partner to start your love language journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Welcome to LoveLingo! To get started, add information about your partner. 
                    This will help us tailor recommendations based on their love language preferences.
                  </p>
                  <Button onClick={() => setShowAddPartner(true)}>Add Partner</Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/quiz">
                      <CalendarHeart className="mr-2 h-4 w-4" />
                      Take Love Language Quiz
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/actions">
                      <CalendarCheck2 className="mr-2 h-4 w-4" />
                      Manage Actions
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/history">
                      <Clock className="mr-2 h-4 w-4" />
                      View History
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </Button>
                </nav>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Love Language Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h3 className="font-medium">Words of Affirmation</h3>
                    <p className="text-sm">Try sending an unexpected text message of appreciation today.</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <h3 className="font-medium">Quality Time</h3>
                    <p className="text-sm">Schedule device-free time to truly connect without distractions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Partner Dialog */}
      <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{partner ? "Edit Partner Information" : "Add Your Partner"}</DialogTitle>
            <DialogDescription>
              Enter your partner's details to personalize your experience
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="quiz">Take Quiz</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <form onSubmit={handleAddPartner}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="partner-name">Partner's Name</Label>
                    <Input 
                      id="partner-name" 
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="primary-language">Primary Love Language</Label>
                    <Select
                      value={newPartner.primaryLoveLanguage}
                      onValueChange={(value) => setNewPartner({...newPartner, primaryLoveLanguage: value})}
                      required
                    >
                      <SelectTrigger id="primary-language">
                        <SelectValue placeholder="Select primary love language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOVE_LANGUAGE_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondary-language">Secondary Love Language</Label>
                    <Select
                      value={newPartner.secondaryLoveLanguage}
                      onValueChange={(value) => setNewPartner({...newPartner, secondaryLoveLanguage: value})}
                    >
                      <SelectTrigger id="secondary-language">
                        <SelectValue placeholder="Select secondary love language (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOVE_LANGUAGE_OPTIONS.map(option => (
                          <SelectItem 
                            key={option.value} 
                            value={option.value}
                            disabled={option.value === newPartner.primaryLoveLanguage}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={!newPartner.name || !newPartner.primaryLoveLanguage}>
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="quiz">
              <div className="py-4">
                <p className="text-sm text-muted-foreground mb-6">
                  Take this short quiz to determine your partner's love languages. 
                  The results will automatically update your partner's profile.
                </p>
                <LoveLanguageQuiz onComplete={handleQuizComplete} />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}