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
import { AppHeader } from "@/components/layout/AppHeader";
import RecommendedActions from "@/components/actions/RecommendedActions";

export default function HomePage() {
  const { user, logout } = useAuth();
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [partner, setPartner] = useState(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    primaryLoveLanguage: "",
    secondaryLoveLanguage: "",
    birthday: "",
    gender: "",
    orientation: ""
  });
  const [activeTab, setActiveTab] = useState("manual");

  const handleAddPartner = (e) => {
    if (e) e.preventDefault();
    setPartner({
      id: "person-" + Date.now(),
      name: newPartner.name,
      primaryLoveLanguage: newPartner.primaryLoveLanguage,
      secondaryLoveLanguage: newPartner.secondaryLoveLanguage,
      birthday: newPartner.birthday,
      gender: newPartner.gender,
      orientation: newPartner.orientation
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
      <AppHeader />

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main content area */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-3xl font-bold">Welcome to LoveLingo</h2>
            
            {partner ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>{partner.name}</CardTitle>
                    <CardDescription>Manage relationship information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-base">Primary Love Language</Label>
                          <p className="text-lg font-medium">
                            {LOVE_LANGUAGE_OPTIONS.find(lang => lang.value === partner.primaryLoveLanguage)?.label || "Not set"}
                          </p>
                        </div>
                        {partner.secondaryLoveLanguage && (
                          <div>
                            <Label className="text-base">Secondary Love Language</Label>
                            <p className="text-lg font-medium">
                              {LOVE_LANGUAGE_OPTIONS.find(lang => lang.value === partner.secondaryLoveLanguage)?.label || "Not set"}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {(partner.birthday || partner.gender || partner.orientation) && (
                        <div className="grid grid-cols-3 gap-4 mt-2 pt-2 border-t">
                          {partner.birthday && (
                            <div>
                              <Label className="text-sm text-muted-foreground">Birthday</Label>
                              <p className="text-sm">{new Date(partner.birthday).toLocaleDateString()}</p>
                            </div>
                          )}
                          {partner.gender && (
                            <div>
                              <Label className="text-sm text-muted-foreground">Gender</Label>
                              <p className="text-sm capitalize">{partner.gender}</p>
                            </div>
                          )}
                          {partner.orientation && (
                            <div>
                              <Label className="text-sm text-muted-foreground">Orientation</Label>
                              <p className="text-sm capitalize">{partner.orientation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setNewPartner({
                          name: partner.name,
                          primaryLoveLanguage: partner.primaryLoveLanguage,
                          secondaryLoveLanguage: partner.secondaryLoveLanguage,
                          birthday: partner.birthday,
                          gender: partner.gender,
                          orientation: partner.orientation
                        });
                        setShowAddPartner(true);
                      }}
                    >
                      Edit Information
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

                {/* Recommended Actions */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Personalized Recommendations</h3>
                  <RecommendedActions partner={partner} count={4} />
                </div>
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Get Started</CardTitle>
                  <CardDescription>Add someone you love to start your love language journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Welcome to LoveLingo! To get started, add information about someone you love. 
                    This will help us tailor recommendations based on their love language preferences.
                  </p>
                  <Button onClick={() => setShowAddPartner(true)}>Add</Button>
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

      {/* Add Person Dialog */}
      <Dialog open={showAddPartner} onOpenChange={setShowAddPartner}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{partner ? "Edit Information" : "Add Someone You Love"}</DialogTitle>
            <DialogDescription>
              Enter their details to personalize your experience
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
                    <Label htmlFor="person-name">Name</Label>
                    <Input 
                      id="person-name" 
                      value={newPartner.name}
                      onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                      placeholder="Enter name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday (Optional)</Label>
                    <Input 
                      id="birthday" 
                      type="date"
                      value={newPartner.birthday}
                      onChange={(e) => setNewPartner({...newPartner, birthday: e.target.value})}
                      placeholder="Select birthday"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender Identity (Optional)</Label>
                      <Select
                        value={newPartner.gender}
                        onValueChange={(value) => setNewPartner({...newPartner, gender: value})}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="orientation">Sexual Orientation (Optional)</Label>
                      <Select
                        value={newPartner.orientation}
                        onValueChange={(value) => setNewPartner({...newPartner, orientation: value})}
                      >
                        <SelectTrigger id="orientation">
                          <SelectValue placeholder="Select orientation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="straight">Straight</SelectItem>
                          <SelectItem value="gay">Gay</SelectItem>
                          <SelectItem value="lesbian">Lesbian</SelectItem>
                          <SelectItem value="bisexual">Bisexual</SelectItem>
                          <SelectItem value="pansexual">Pansexual</SelectItem>
                          <SelectItem value="asexual">Asexual</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                  Take this short quiz to determine their love languages. 
                  The results will automatically update their profile.
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