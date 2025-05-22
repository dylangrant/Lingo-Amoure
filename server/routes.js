import fastify from 'fastify';
import { storage } from './storage.js';
import { createServer } from 'http';
import mercurius from 'mercurius';
import { schema } from './graphql/schema.js';
import { resolvers } from './graphql/resolvers.js';
import { setupAuth, isAuthenticated } from './auth.js';

export async function registerRoutes(app) {
  const httpServer = createServer(app);
  
  // Setup authentication
  await setupAuth(app);
  
  // Initialize GraphQL with Mercurius
  app.register(mercurius, {
    schema,
    resolvers,
    graphiql: process.env.NODE_ENV === 'development',
    path: '/api/graphql',
    context: (request) => {
      return {
        user: request.user?.claims,
        isAuthenticated: request.isAuthenticated(),
        storage
      };
    }
  });

  // User routes
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.patch('/api/users/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { partnerName, primaryLoveLanguage } = req.body;
      
      const updatedUser = await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        partnerName,
        primaryLoveLanguage
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Actions routes
  app.get('/api/actions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const actions = await storage.getActions(userId);
      res.json(actions);
    } catch (error) {
      console.error("Error fetching actions:", error);
      res.status(500).json({ message: "Failed to fetch actions" });
    }
  });

  app.post('/api/actions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const action = req.body;
      
      const newAction = await storage.createAction({
        ...action,
        userId,
        isCustom: true
      });
      
      res.status(201).json(newAction);
    } catch (error) {
      console.error("Error creating action:", error);
      res.status(500).json({ message: "Failed to create action" });
    }
  });

  app.patch('/api/actions/:id/rate', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { likeStatus } = req.body;
      
      const action = await storage.getActionById(id);
      if (!action) {
        return res.status(404).json({ message: "Action not found" });
      }
      
      const updatedAction = await storage.rateAction(id, likeStatus);
      res.json(updatedAction);
    } catch (error) {
      console.error("Error rating action:", error);
      res.status(500).json({ message: "Failed to rate action" });
    }
  });

  // Scheduled actions routes
  app.get('/api/scheduled-actions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const scheduledActions = await storage.getScheduledActions(userId);
      res.json(scheduledActions);
    } catch (error) {
      console.error("Error fetching scheduled actions:", error);
      res.status(500).json({ message: "Failed to fetch scheduled actions" });
    }
  });

  app.post('/api/scheduled-actions', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { actionId, scheduledDate } = req.body;
      
      const newScheduledAction = await storage.createScheduledAction({
        userId,
        actionId,
        scheduledDate: new Date(scheduledDate),
        completed: false,
        isReminded: false
      });
      
      res.status(201).json(newScheduledAction);
    } catch (error) {
      console.error("Error creating scheduled action:", error);
      res.status(500).json({ message: "Failed to create scheduled action" });
    }
  });

  app.patch('/api/scheduled-actions/:id/complete', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      
      const scheduledAction = await storage.getScheduledActionById(id);
      if (!scheduledAction) {
        return res.status(404).json({ message: "Scheduled action not found" });
      }
      
      const updatedScheduledAction = await storage.updateScheduledAction(id, {
        ...scheduledAction,
        completed: true
      });
      
      res.json(updatedScheduledAction);
    } catch (error) {
      console.error("Error completing scheduled action:", error);
      res.status(500).json({ message: "Failed to complete scheduled action" });
    }
  });

  // Notification settings routes
  app.get('/api/notification-settings', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      let settings = await storage.getNotificationSettings(userId);
      
      if (!settings) {
        // Create default settings if none exist
        settings = await storage.upsertNotificationSettings({
          userId,
          emailEnabled: true,
          pushEnabled: true,
          smsEnabled: false,
          phoneNumber: null,
          quickActionInterval: { min: 1, max: 5 },
          mediumActionInterval: { min: 6, max: 14 },
          specialActionInterval: { min: 15, max: 30 },
          grandActionInterval: { min: 31, max: 90 }
        });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching notification settings:", error);
      res.status(500).json({ message: "Failed to fetch notification settings" });
    }
  });

  app.post('/api/notification-settings', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = req.body;
      
      const updatedSettings = await storage.upsertNotificationSettings({
        ...settings,
        userId
      });
      
      res.json(updatedSettings);
    } catch (error) {
      console.error("Error updating notification settings:", error);
      res.status(500).json({ message: "Failed to update notification settings" });
    }
  });

  // Quiz routes
  app.post('/api/quiz', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { responses, result } = req.body;
      
      const quizResponse = await storage.saveQuizResponse({
        userId,
        responses,
        result,
        completedAt: new Date()
      });
      
      // Update user's primary love language based on quiz result
      await storage.upsertUser({
        id: userId,
        email: req.user.claims.email,
        firstName: req.user.claims.first_name,
        lastName: req.user.claims.last_name,
        profileImageUrl: req.user.claims.profile_image_url,
        primaryLoveLanguage: result.primary
      });
      
      res.status(201).json(quizResponse);
    } catch (error) {
      console.error("Error saving quiz response:", error);
      res.status(500).json({ message: "Failed to save quiz response" });
    }
  });

  // Recommendation routes
  app.get('/api/recommendations', isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const { loveLanguage, limit } = req.query;
      
      if (!loveLanguage) {
        return res.status(400).json({ message: "Love language is required" });
      }
      
      const recommendations = await storage.getRecommendations(
        userId, 
        loveLanguage, 
        limit ? parseInt(limit) : 3
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  return httpServer;
}
