export const resolvers = {
  Query: {
    me: async (_, __, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) return null;
      return await storage.getUser(user.sub);
    },
    
    actions: async (_, __, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) return [];
      return await storage.getActions(user.sub);
    },
    
    action: async (_, { id }, { isAuthenticated, storage }) => {
      if (!isAuthenticated) return null;
      return await storage.getActionById(id);
    },
    
    recommendations: async (_, { loveLanguage, limit = 3 }, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) return [];
      return await storage.getRecommendations(user.sub, loveLanguage, limit);
    },
    
    scheduledActions: async (_, __, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) return [];
      return await storage.getScheduledActions(user.sub);
    },
    
    notificationSettings: async (_, __, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) return null;
      
      let settings = await storage.getNotificationSettings(user.sub);
      
      if (!settings) {
        settings = await storage.upsertNotificationSettings({
          userId: user.sub,
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
      
      return settings;
    },
    
    quizResponses: async (_, __, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) return [];
      return await storage.getQuizResponses(user.sub);
    }
  },
  
  Mutation: {
    updateProfile: async (_, { partnerName, primaryLoveLanguage }, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      return await storage.upsertUser({
        id: user.sub,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        partnerName,
        primaryLoveLanguage
      });
    },
    
    createAction: async (_, { action }, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      return await storage.createAction({
        ...action,
        userId: user.sub,
        isCustom: true,
        likeStatus: 'neutral'
      });
    },
    
    rateAction: async (_, { id, likeStatus }, { isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const action = await storage.getActionById(id);
      if (!action) throw new Error('Action not found');
      
      return await storage.rateAction(id, likeStatus);
    },
    
    scheduleAction: async (_, { input }, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const { actionId, scheduledDate } = input;
      
      const action = await storage.getActionById(actionId);
      if (!action) throw new Error('Action not found');
      
      return await storage.createScheduledAction({
        userId: user.sub,
        actionId,
        scheduledDate: new Date(scheduledDate),
        completed: false,
        isReminded: false
      });
    },
    
    completeScheduledAction: async (_, { id }, { isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const scheduledAction = await storage.getScheduledActionById(id);
      if (!scheduledAction) throw new Error('Scheduled action not found');
      
      return await storage.updateScheduledAction(id, {
        ...scheduledAction,
        completed: true
      });
    },
    
    updateNotificationSettings: async (_, { settings }, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      return await storage.upsertNotificationSettings({
        ...settings,
        userId: user.sub
      });
    },
    
    saveQuizResponse: async (_, { input }, { user, isAuthenticated, storage }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      
      const { responses, result } = input;
      
      const quizResponse = await storage.saveQuizResponse({
        userId: user.sub,
        responses,
        result,
        completedAt: new Date()
      });
      
      // Update user's primary love language based on quiz result
      await storage.upsertUser({
        id: user.sub,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profileImageUrl: user.profile_image_url,
        primaryLoveLanguage: result.primary
      });
      
      return quizResponse;
    }
  },
  
  ScoreMap: {
    // Custom scalar resolver for score map
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => {
      if (ast.kind === 'ObjectValue') {
        const result = {};
        ast.fields.forEach((field) => {
          const key = field.name.value;
          const value = parseInt(field.value.value, 10);
          result[key] = value;
        });
        return result;
      }
      return null;
    }
  },
  
  ScoreMapInput: {
    // Custom scalar resolver for score map input
    serialize: (value) => value,
    parseValue: (value) => value,
    parseLiteral: (ast) => {
      if (ast.kind === 'ObjectValue') {
        const result = {};
        ast.fields.forEach((field) => {
          const key = field.name.value;
          const value = parseInt(field.value.value, 10);
          result[key] = value;
        });
        return result;
      }
      return null;
    }
  }
};
