import { useState, useEffect } from "react";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, PlusCircle, Edit, Trash2, CheckCircle, Clock, Filter, Search, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LOVE_LANGUAGE_OPTIONS, ACTION_TIER_OPTIONS } from "@/constants/loveLanguages";
import { getRecommendedActions, getActionsByLoveLanguage, getActionsByTier, addCustomAction } from "@/services/recommendationEngine";
import { AppHeader } from "@/components/layout/AppHeader";
import { useNotifications } from "@/components/notifications/NotificationService";

const ActionsPage = () => {
  const { user, logout } = useAuth();
  const { scheduleActionNotification, sendCompletionNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [actions, setActions] = useState([]);
  const [scheduledActions, setScheduledActions] = useState([]);
  const [completedActions, setCompletedActions] = useState([]);
  const [showAddActionDialog, setShowAddActionDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [scheduledTime, setScheduledTime] = useState("");
  const [filterLoveLanguage, setFilterLoveLanguage] = useState("");
  const [filterTier, setFilterTier] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newAction, setNewAction] = useState({
    title: "",
    description: "",
    loveLanguage: "",
    tier: "",
    isCustom: true
  });

  // Load saved actions from localStorage
  useEffect(() => {
    try {
      // Load scheduled actions
      const savedScheduledActions = localStorage.getItem("lovelingoScheduledActions");
      if (savedScheduledActions) {
        setScheduledActions(JSON.parse(savedScheduledActions));
      }

      // Load completed actions
      const savedCompletedActions = localStorage.getItem("lovelingoCompletedActions");
      if (savedCompletedActions) {
        setCompletedActions(JSON.parse(savedCompletedActions));
      }

      // Get all available actions
      const allRecommendedActions = getRecommendedActions({
        count: 100 // Get a large sample to populate our actions library
      });
      setActions(allRecommendedActions);
    } catch (error) {
      console.error("Error loading saved actions:", error);
    }
  }, []);

  // Filter actions based on search query and filters
  const getFilteredActions = () => {
    let filtered = [...actions];

    // Apply love language filter
    if (filterLoveLanguage && filterLoveLanguage !== "all") {
      filtered = filtered.filter(action => action.loveLanguage === filterLoveLanguage);
    }

    // Apply tier filter
    if (filterTier && filterTier !== "all") {
      filtered = filtered.filter(action => action.tier === filterTier);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        action => 
          action.title.toLowerCase().includes(query) || 
          (action.description && action.description.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  // Get upcoming scheduled actions
  const getUpcomingActions = () => {
    return scheduledActions
      .filter(action => !action.completed)
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  };

  // Mark an action as completed
  const handleCompleteAction = (actionId) => {
    const updatedScheduled = scheduledActions.map(action => {
      if (action.id === actionId) {
        // Copy the action to completed list with completion timestamp
        const completedAction = {
          ...action,
          completed: true,
          completedAt: new Date().toISOString()
        };
        
        // Add to completed actions
        const newCompletedActions = [...completedActions, completedAction];
        setCompletedActions(newCompletedActions);
        localStorage.setItem("lovelingoCompletedActions", JSON.stringify(newCompletedActions));
        
        // Send completion notification
        sendCompletionNotification(completedAction);
        
        return completedAction;
      }
      return action;
    });
    
    setScheduledActions(updatedScheduled);
    localStorage.setItem("lovelingoScheduledActions", JSON.stringify(updatedScheduled));
  };

  // Delete a scheduled action
  const handleDeleteAction = (actionId) => {
    const updatedActions = scheduledActions.filter(action => action.id !== actionId);
    setScheduledActions(updatedActions);
    localStorage.setItem("lovelingoScheduledActions", JSON.stringify(updatedActions));
  };

  // Add a new custom action
  const handleAddAction = () => {
    setIsAddingAction(true);
    
    try {
      // Add the custom action to our database
      const addedAction = addCustomAction(newAction);
      
      // Refresh the actions list
      setActions(prev => [...prev, addedAction]);
      
      // Reset the form
      setNewAction({
        title: "",
        description: "",
        loveLanguage: "",
        tier: "",
        isCustom: true
      });
      
      setShowAddActionDialog(false);
      setIsAddingAction(false);
    } catch (error) {
      console.error("Error adding custom action:", error);
      setIsAddingAction(false);
    }
  };

  // Schedule an action
  const handleScheduleAction = () => {
    if (!scheduledDate || !selectedAction) return;
    
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
    
    const updatedScheduledActions = [...scheduledActions, newScheduledAction];
    setScheduledActions(updatedScheduledActions);
    localStorage.setItem("lovelingoScheduledActions", JSON.stringify(updatedScheduledActions));
    
    setShowScheduleDialog(false);
  };

  // Open schedule dialog for an action
  const openScheduleDialog = (action) => {
    setSelectedAction(action);
    setScheduledDate(new Date());
    setScheduledTime("");
    setShowScheduleDialog(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader />

      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Love Language Actions</h2>
          <Button onClick={() => setShowAddActionDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Custom Action
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="all">All Actions</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          {/* Upcoming Actions Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Actions</CardTitle>
                <CardDescription>Actions you've scheduled for the future</CardDescription>
              </CardHeader>
              <CardContent>
                {getUpcomingActions().length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">You don't have any upcoming actions scheduled.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("all")}
                    >
                      Browse Actions
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getUpcomingActions().map(action => (
                      <div key={action.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex flex-col items-center gap-2">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center",
                            action.loveLanguage === "WORDS_OF_AFFIRMATION" && "bg-pink-100 text-pink-800",
                            action.loveLanguage === "ACTS_OF_SERVICE" && "bg-blue-100 text-blue-800",
                            action.loveLanguage === "RECEIVING_GIFTS" && "bg-purple-100 text-purple-800",
                            action.loveLanguage === "QUALITY_TIME" && "bg-green-100 text-green-800",
                            action.loveLanguage === "PHYSICAL_TOUCH" && "bg-amber-100 text-amber-800"
                          )}>
                            {new Date(action.scheduledDate).getDate()}
                          </div>
                          <span className="text-xs">
                            {format(new Date(action.scheduledDate), "MMM")}
                          </span>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-medium">{action.title}</h3>
                          {action.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {action.description}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className={cn(
                              action.loveLanguage === "WORDS_OF_AFFIRMATION" && "bg-pink-100 text-pink-800",
                              action.loveLanguage === "ACTS_OF_SERVICE" && "bg-blue-100 text-blue-800",
                              action.loveLanguage === "RECEIVING_GIFTS" && "bg-purple-100 text-purple-800",
                              action.loveLanguage === "QUALITY_TIME" && "bg-green-100 text-green-800",
                              action.loveLanguage === "PHYSICAL_TOUCH" && "bg-amber-100 text-amber-800"
                            )}>
                              {LOVE_LANGUAGE_OPTIONS.find(lang => lang.value === action.loveLanguage)?.label || action.loveLanguage}
                            </Badge>
                            <Badge variant="outline">
                              {action.tier}
                            </Badge>
                            {action.scheduledTime && (
                              <Badge variant="outline" className="bg-gray-100">
                                <Clock className="h-3 w-3 mr-1" />
                                {action.scheduledTime}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleCompleteAction(action.id)} 
                            title="Mark as completed"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteAction(action.id)}
                            title="Delete action"
                          >
                            <Trash2 className="h-5 w-5 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* All Actions Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Actions</CardTitle>
                <CardDescription>Browse and schedule actions from our library</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search actions..." 
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={filterLoveLanguage} onValueChange={setFilterLoveLanguage}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Love Language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Languages</SelectItem>
                          {LOVE_LANGUAGE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterTier} onValueChange={setFilterTier}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Effort Level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Levels</SelectItem>
                          {ACTION_TIER_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setFilterLoveLanguage("");
                          setFilterTier("");
                          setSearchQuery("");
                        }}
                        title="Clear filters"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Love Language</TableHead>
                          <TableHead>Effort Level</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredActions().map(action => (
                          <TableRow key={action.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{action.title}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {action.description}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                action.loveLanguage === "WORDS_OF_AFFIRMATION" && "bg-pink-100 text-pink-800",
                                action.loveLanguage === "ACTS_OF_SERVICE" && "bg-blue-100 text-blue-800",
                                action.loveLanguage === "RECEIVING_GIFTS" && "bg-purple-100 text-purple-800",
                                action.loveLanguage === "QUALITY_TIME" && "bg-green-100 text-green-800",
                                action.loveLanguage === "PHYSICAL_TOUCH" && "bg-amber-100 text-amber-800"
                              )}>
                                {LOVE_LANGUAGE_OPTIONS.find(lang => lang.value === action.loveLanguage)?.label || action.loveLanguage}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn(
                                action.tier === "Quick & Easy" && "bg-green-100 text-green-800",
                                action.tier === "Medium Effort" && "bg-blue-100 text-blue-800",
                                action.tier === "Special Occasion" && "bg-purple-100 text-purple-800",
                                action.tier === "Grand Gesture" && "bg-pink-100 text-pink-800"
                              )}>
                                {action.tier}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => openScheduleDialog(action)}
                              >
                                Schedule
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Completed Actions Tab */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Actions</CardTitle>
                <CardDescription>A history of your love language expressions</CardDescription>
              </CardHeader>
              <CardContent>
                {completedActions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">You haven't completed any actions yet.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("upcoming")}
                    >
                      View Upcoming Actions
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedActions
                      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                      .map(action => (
                        <div key={action.id} className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-green-800">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <span className="text-xs">
                              {format(new Date(action.completedAt), "MMM d")}
                            </span>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-medium">{action.title}</h3>
                            {action.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {action.description}
                              </p>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline" className={cn(
                                action.loveLanguage === "WORDS_OF_AFFIRMATION" && "bg-pink-100 text-pink-800",
                                action.loveLanguage === "ACTS_OF_SERVICE" && "bg-blue-100 text-blue-800",
                                action.loveLanguage === "RECEIVING_GIFTS" && "bg-purple-100 text-purple-800",
                                action.loveLanguage === "QUALITY_TIME" && "bg-green-100 text-green-800",
                                action.loveLanguage === "PHYSICAL_TOUCH" && "bg-amber-100 text-amber-800"
                              )}>
                                {LOVE_LANGUAGE_OPTIONS.find(lang => lang.value === action.loveLanguage)?.label || action.loveLanguage}
                              </Badge>
                              <Badge variant="outline">
                                {action.tier}
                              </Badge>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Custom Action Dialog */}
      <Dialog open={showAddActionDialog} onOpenChange={setShowAddActionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Custom Action</DialogTitle>
            <DialogDescription>
              Add your own love language action to the library
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="action-title">Action Title</Label>
              <Input 
                id="action-title" 
                placeholder="Enter a title for this action"
                value={newAction.title}
                onChange={(e) => setNewAction({ ...newAction, title: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="action-description">Description</Label>
              <Textarea 
                id="action-description" 
                placeholder="Describe the action in more detail..."
                rows={3}
                value={newAction.description}
                onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="action-language">Love Language</Label>
                <Select
                  value={newAction.loveLanguage}
                  onValueChange={(value) => setNewAction({ ...newAction, loveLanguage: value })}
                  required
                >
                  <SelectTrigger id="action-language">
                    <SelectValue placeholder="Select love language" />
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
                <Label htmlFor="action-tier">Effort Level</Label>
                <Select
                  value={newAction.tier}
                  onValueChange={(value) => setNewAction({ ...newAction, tier: value })}
                  required
                >
                  <SelectTrigger id="action-tier">
                    <SelectValue placeholder="Select effort level" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_TIER_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddActionDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddAction}
              disabled={!newAction.title || !newAction.loveLanguage || !newAction.tier || isAddingAction}
            >
              {isAddingAction ? "Adding..." : "Add Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                      disabled={{ before: new Date() }}
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
                
                <div className="flex items-center space-x-2">
                  <Switch id="add-reminder" />
                  <Label htmlFor="add-reminder">Set reminder</Label>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleAction} disabled={!scheduledDate}>
              Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActionsPage;