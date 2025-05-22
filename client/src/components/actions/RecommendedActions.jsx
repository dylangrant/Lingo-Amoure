import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThumbsUp, ThumbsDown, CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { getRecommendedActions, recordActionFeedback } from "@/services/recommendationEngine";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const RecommendedActions = ({ partner, count = 6 }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [userFeedback, setUserFeedback] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load any saved user feedback from localStorage
  useEffect(() => {
    try {
      const savedFeedback = localStorage.getItem('lovelingoUserFeedback');
      if (savedFeedback) {
        setUserFeedback(JSON.parse(savedFeedback));
      }
    } catch (error) {
      console.error("Error loading user feedback:", error);
    }
    
    setLoading(false);
  }, []);

  // Get recommendations based on partner's love languages
  useEffect(() => {
    if (partner && partner.primaryLoveLanguage && !loading) {
      // Get action recommendations from the engine
      const recommendedActions = getRecommendedActions({
        primaryLoveLanguage: partner.primaryLoveLanguage,
        secondaryLoveLanguage: partner.secondaryLoveLanguage,
        partnerGender: partner.gender,
        userFeedback: userFeedback,
        count: count
      });
      
      setRecommendations(recommendedActions);
    }
  }, [partner, userFeedback, loading, count]);

  // Handle like/dislike feedback
  const handleFeedback = (actionId, feedback) => {
    const updatedFeedback = recordActionFeedback(actionId, feedback, userFeedback);
    setUserFeedback(updatedFeedback);
  };

  // Handle scheduling an action
  const openScheduleDialog = (action) => {
    setSelectedAction(action);
    setScheduledDate(new Date());
    setScheduledTime('');
    setShowScheduleDialog(true);
  };

  const handleScheduleAction = () => {
    if (!scheduledDate) return;
    
    // In a real app, this would save to a database via API
    const scheduledActions = JSON.parse(localStorage.getItem('lovelingoScheduledActions') || '[]');
    
    const newScheduledAction = {
      id: `scheduled-${Date.now()}`,
      actionId: selectedAction.id,
      title: selectedAction.title,
      description: selectedAction.description,
      loveLanguage: selectedAction.loveLanguage,
      tier: selectedAction.tier,
      scheduledDate: scheduledDate.toISOString(),
      scheduledTime: scheduledTime,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    scheduledActions.push(newScheduledAction);
    localStorage.setItem('lovelingoScheduledActions', JSON.stringify(scheduledActions));
    
    // Close the dialog
    setShowScheduleDialog(false);
    
    // Show toast notification (this would use the toast system in a real app)
    alert("Action scheduled successfully!");
  };

  if (!partner || !partner.primaryLoveLanguage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Add a partner to see recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-8 text-muted-foreground">
            To get personalized love language recommendations, add your partner's information first.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>Loading recommendations...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
          <CardDescription>
            Personalized suggestions based on {partner.name}'s love languages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No recommendations available. Try updating your partner's love language preferences.
            </p>
          ) : (
            recommendations.map(action => (
              <div key={action.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    action.tier === "Quick & Easy" && "bg-green-100 text-green-800",
                    action.tier === "Medium Effort" && "bg-blue-100 text-blue-800",
                    action.tier === "Special Occasion" && "bg-purple-100 text-purple-800",
                    action.tier === "Grand Gesture" && "bg-pink-100 text-pink-800"
                  )}>
                    {action.tier}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={userFeedback[action.id] === 'like' ? "bg-primary/10" : ""}
                      onClick={() => handleFeedback(action.id, 'like')}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>Like</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={userFeedback[action.id] === 'dislike' ? "bg-primary/10" : ""}
                      onClick={() => handleFeedback(action.id, 'dislike')}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span>Dislike</span>
                    </Button>
                  </div>
                  
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => openScheduleDialog(action)}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Schedule</span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Recommendations
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      {/* Schedule Action Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Action</DialogTitle>
            <DialogDescription>
              Choose when you'd like to perform this action
            </DialogDescription>
          </DialogHeader>
          
          {selectedAction && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium">{selectedAction.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedAction.description}</p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Date</Label>
                  <div className="border rounded-md">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      initialFocus
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Select Time (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        id="time"
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        {scheduledTime ? scheduledTime : "Select time"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
                          "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"].map((time) => (
                          <Button
                            key={time}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setScheduledTime(time);
                              document.body.click(); // Close the popover
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={handleScheduleAction} disabled={!scheduledDate}>
              Schedule Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecommendedActions;