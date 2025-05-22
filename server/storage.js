import neo4j from 'neo4j-driver';
import { nanoid } from 'nanoid';

// Interface for storage operations
export class IStorage {
  // User
  getUser(id) {}
  upsertUser(userData) {}
  
  // Actions
  getActions(userId) {}
  getActionById(id) {}
  createAction(action) {}
  updateAction(id, action) {}
  deleteAction(id) {}
  
  // Scheduled Actions
  getScheduledActions(userId) {}
  getScheduledActionById(id) {}
  createScheduledAction(scheduledAction) {}
  updateScheduledAction(id, scheduledAction) {}
  deleteScheduledAction(id) {}
  
  // Notifications
  getNotificationSettings(userId) {}
  upsertNotificationSettings(settings) {}
  
  // Quiz
  saveQuizResponse(quizResponse) {}
  getQuizResponses(userId) {}
  
  // Recommendation
  getRecommendations(userId, loveLanguage, limit) {}
  rateAction(id, likeStatus) {}
}

// Neo4j Storage implementation
export class Neo4jStorage extends IStorage {
  constructor() {
    super();
    
    const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    const user = process.env.NEO4J_USER || 'neo4j';
    const password = process.env.NEO4J_PASSWORD || 'password';
    
    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    
    this.initializeDb();
  }
  
  async initializeDb() {
    // Create constraints and indexes
    const session = this.driver.session();
    try {
      // Create constraints
      await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE');
      await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (a:Action) REQUIRE a.id IS UNIQUE');
      await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (s:ScheduledAction) REQUIRE s.id IS UNIQUE');
      await session.run('CREATE CONSTRAINT IF NOT EXISTS FOR (n:NotificationSettings) REQUIRE n.userId IS UNIQUE');
      
      // Create indexes
      await session.run('CREATE INDEX IF NOT EXISTS FOR (a:Action) ON (a.loveLanguage)');
      await session.run('CREATE INDEX IF NOT EXISTS FOR (a:Action) ON (a.tier)');
      await session.run('CREATE INDEX IF NOT EXISTS FOR (s:ScheduledAction) ON (s.scheduledDate)');
    } catch (error) {
      console.error('Error initializing Neo4j:', error);
    } finally {
      await session.close();
    }
  }
  
  // User methods
  async getUser(id) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $id}) 
         RETURN u`,
        { id }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      const user = result.records[0].get('u').properties;
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async upsertUser(userData) {
    const session = this.driver.session();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MERGE (u:User {id: $id})
         ON CREATE SET 
           u.email = $email,
           u.firstName = $firstName,
           u.lastName = $lastName,
           u.profileImageUrl = $profileImageUrl,
           u.partnerName = $partnerName,
           u.primaryLoveLanguage = $primaryLoveLanguage,
           u.createdAt = $now,
           u.updatedAt = $now
         ON MATCH SET 
           u.email = $email,
           u.firstName = $firstName,
           u.lastName = $lastName,
           u.profileImageUrl = $profileImageUrl,
           u.partnerName = CASE WHEN $partnerName IS NULL THEN u.partnerName ELSE $partnerName END,
           u.primaryLoveLanguage = CASE WHEN $primaryLoveLanguage IS NULL THEN u.primaryLoveLanguage ELSE $primaryLoveLanguage END,
           u.updatedAt = $now
         RETURN u`,
        { 
          ...userData,
          partnerName: userData.partnerName || null,
          primaryLoveLanguage: userData.primaryLoveLanguage || null,
          now 
        }
      );
      
      const user = result.records[0].get('u').properties;
      return {
        ...user,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      };
    } catch (error) {
      console.error('Error upserting user:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // Actions methods
  async getActions(userId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:CREATED]->(a:Action)
         RETURN a
         ORDER BY a.createdAt DESC`,
        { userId }
      );
      
      return result.records.map(record => {
        const action = record.get('a').properties;
        return {
          ...action,
          createdAt: new Date(action.createdAt),
          updatedAt: new Date(action.updatedAt)
        };
      });
    } catch (error) {
      console.error('Error getting actions:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async getActionById(id) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (a:Action {id: $id})
         RETURN a`,
        { id }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      const action = result.records[0].get('a').properties;
      return {
        ...action,
        createdAt: new Date(action.createdAt),
        updatedAt: new Date(action.updatedAt)
      };
    } catch (error) {
      console.error('Error getting action by id:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async createAction(action) {
    const session = this.driver.session();
    const id = nanoid();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
         CREATE (a:Action {
           id: $id,
           userId: $userId,
           description: $description,
           loveLanguage: $loveLanguage,
           tier: $tier,
           productLink: $productLink,
           isCustom: $isCustom,
           likeStatus: $likeStatus,
           createdAt: $now,
           updatedAt: $now
         })
         CREATE (u)-[:CREATED]->(a)
         RETURN a`,
        { 
          ...action, 
          id, 
          productLink: action.productLink || null,
          now 
        }
      );
      
      const newAction = result.records[0].get('a').properties;
      return {
        ...newAction,
        createdAt: new Date(newAction.createdAt),
        updatedAt: new Date(newAction.updatedAt)
      };
    } catch (error) {
      console.error('Error creating action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async updateAction(id, action) {
    const session = this.driver.session();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MATCH (a:Action {id: $id})
         SET a.description = $description,
             a.loveLanguage = $loveLanguage,
             a.tier = $tier,
             a.productLink = $productLink,
             a.likeStatus = $likeStatus,
             a.updatedAt = $now
         RETURN a`,
        { 
          id,
          description: action.description,
          loveLanguage: action.loveLanguage,
          tier: action.tier,
          productLink: action.productLink || null,
          likeStatus: action.likeStatus,
          now 
        }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      const updatedAction = result.records[0].get('a').properties;
      return {
        ...updatedAction,
        createdAt: new Date(updatedAction.createdAt),
        updatedAt: new Date(updatedAction.updatedAt)
      };
    } catch (error) {
      console.error('Error updating action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async deleteAction(id) {
    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (a:Action {id: $id})
         DETACH DELETE a`,
        { id }
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async rateAction(id, likeStatus) {
    const session = this.driver.session();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MATCH (a:Action {id: $id})
         SET a.likeStatus = $likeStatus,
             a.updatedAt = $now
         RETURN a`,
        { id, likeStatus, now }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      const updatedAction = result.records[0].get('a').properties;
      return {
        ...updatedAction,
        createdAt: new Date(updatedAction.createdAt),
        updatedAt: new Date(updatedAction.updatedAt)
      };
    } catch (error) {
      console.error('Error rating action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // Scheduled Actions methods
  async getScheduledActions(userId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:SCHEDULED]->(s:ScheduledAction)-[:FOR_ACTION]->(a:Action)
         RETURN s, a
         ORDER BY s.scheduledDate ASC`,
        { userId }
      );
      
      return result.records.map(record => {
        const scheduledAction = record.get('s').properties;
        const action = record.get('a').properties;
        
        return {
          ...scheduledAction,
          action: {
            ...action,
            createdAt: new Date(action.createdAt),
            updatedAt: new Date(action.updatedAt)
          },
          scheduledDate: new Date(scheduledAction.scheduledDate),
          createdAt: new Date(scheduledAction.createdAt),
          updatedAt: new Date(scheduledAction.updatedAt)
        };
      });
    } catch (error) {
      console.error('Error getting scheduled actions:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async getScheduledActionById(id) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (s:ScheduledAction {id: $id})-[:FOR_ACTION]->(a:Action)
         RETURN s, a`,
        { id }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      const scheduledAction = result.records[0].get('s').properties;
      const action = result.records[0].get('a').properties;
      
      return {
        ...scheduledAction,
        action: {
          ...action,
          createdAt: new Date(action.createdAt),
          updatedAt: new Date(action.updatedAt)
        },
        scheduledDate: new Date(scheduledAction.scheduledDate),
        createdAt: new Date(scheduledAction.createdAt),
        updatedAt: new Date(scheduledAction.updatedAt)
      };
    } catch (error) {
      console.error('Error getting scheduled action by id:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async createScheduledAction(scheduledAction) {
    const session = this.driver.session();
    const id = nanoid();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId}), (a:Action {id: $actionId})
         CREATE (s:ScheduledAction {
           id: $id,
           userId: $userId,
           actionId: $actionId,
           scheduledDate: $scheduledDate,
           completed: $completed,
           isReminded: $isReminded,
           createdAt: $now,
           updatedAt: $now
         })
         CREATE (u)-[:SCHEDULED]->(s)
         CREATE (s)-[:FOR_ACTION]->(a)
         RETURN s, a`,
        { 
          ...scheduledAction, 
          id, 
          scheduledDate: scheduledAction.scheduledDate.toISOString(),
          now 
        }
      );
      
      const newScheduledAction = result.records[0].get('s').properties;
      const action = result.records[0].get('a').properties;
      
      return {
        ...newScheduledAction,
        action: {
          ...action,
          createdAt: new Date(action.createdAt),
          updatedAt: new Date(action.updatedAt)
        },
        scheduledDate: new Date(newScheduledAction.scheduledDate),
        createdAt: new Date(newScheduledAction.createdAt),
        updatedAt: new Date(newScheduledAction.updatedAt)
      };
    } catch (error) {
      console.error('Error creating scheduled action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async updateScheduledAction(id, scheduledAction) {
    const session = this.driver.session();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MATCH (s:ScheduledAction {id: $id})
         SET s.scheduledDate = $scheduledDate,
             s.completed = $completed,
             s.isReminded = $isReminded,
             s.updatedAt = $now
         RETURN s`,
        { 
          id,
          scheduledDate: scheduledAction.scheduledDate.toISOString(),
          completed: scheduledAction.completed,
          isReminded: scheduledAction.isReminded,
          now 
        }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      // Get the action separately
      const actionResult = await session.run(
        `MATCH (s:ScheduledAction {id: $id})-[:FOR_ACTION]->(a:Action)
         RETURN a`,
        { id }
      );
      
      const scheduledActionData = result.records[0].get('s').properties;
      const action = actionResult.records[0].get('a').properties;
      
      return {
        ...scheduledActionData,
        action: {
          ...action,
          createdAt: new Date(action.createdAt),
          updatedAt: new Date(action.updatedAt)
        },
        scheduledDate: new Date(scheduledActionData.scheduledDate),
        createdAt: new Date(scheduledActionData.createdAt),
        updatedAt: new Date(scheduledActionData.updatedAt)
      };
    } catch (error) {
      console.error('Error updating scheduled action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async deleteScheduledAction(id) {
    const session = this.driver.session();
    try {
      await session.run(
        `MATCH (s:ScheduledAction {id: $id})
         DETACH DELETE s`,
        { id }
      );
      
      return true;
    } catch (error) {
      console.error('Error deleting scheduled action:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // Notification Settings methods
  async getNotificationSettings(userId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (n:NotificationSettings {userId: $userId})
         RETURN n`,
        { userId }
      );
      
      if (result.records.length === 0) {
        return undefined;
      }
      
      const settings = result.records[0].get('n').properties;
      return {
        ...settings,
        quickActionInterval: JSON.parse(settings.quickActionInterval),
        mediumActionInterval: JSON.parse(settings.mediumActionInterval),
        specialActionInterval: JSON.parse(settings.specialActionInterval),
        grandActionInterval: JSON.parse(settings.grandActionInterval),
        createdAt: new Date(settings.createdAt),
        updatedAt: new Date(settings.updatedAt)
      };
    } catch (error) {
      console.error('Error getting notification settings:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async upsertNotificationSettings(settings) {
    const session = this.driver.session();
    const id = nanoid();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MERGE (n:NotificationSettings {userId: $userId})
         ON CREATE SET 
           n.id = $id,
           n.emailEnabled = $emailEnabled,
           n.pushEnabled = $pushEnabled,
           n.smsEnabled = $smsEnabled,
           n.phoneNumber = $phoneNumber,
           n.quickActionInterval = $quickActionInterval,
           n.mediumActionInterval = $mediumActionInterval,
           n.specialActionInterval = $specialActionInterval,
           n.grandActionInterval = $grandActionInterval,
           n.createdAt = $now,
           n.updatedAt = $now
         ON MATCH SET 
           n.emailEnabled = $emailEnabled,
           n.pushEnabled = $pushEnabled,
           n.smsEnabled = $smsEnabled,
           n.phoneNumber = $phoneNumber,
           n.quickActionInterval = $quickActionInterval,
           n.mediumActionInterval = $mediumActionInterval,
           n.specialActionInterval = $specialActionInterval,
           n.grandActionInterval = $grandActionInterval,
           n.updatedAt = $now
         RETURN n`,
        { 
          ...settings, 
          id,
          phoneNumber: settings.phoneNumber || null,
          quickActionInterval: JSON.stringify(settings.quickActionInterval),
          mediumActionInterval: JSON.stringify(settings.mediumActionInterval),
          specialActionInterval: JSON.stringify(settings.specialActionInterval),
          grandActionInterval: JSON.stringify(settings.grandActionInterval),
          now 
        }
      );
      
      const updatedSettings = result.records[0].get('n').properties;
      return {
        ...updatedSettings,
        quickActionInterval: JSON.parse(updatedSettings.quickActionInterval),
        mediumActionInterval: JSON.parse(updatedSettings.mediumActionInterval),
        specialActionInterval: JSON.parse(updatedSettings.specialActionInterval),
        grandActionInterval: JSON.parse(updatedSettings.grandActionInterval),
        createdAt: new Date(updatedSettings.createdAt),
        updatedAt: new Date(updatedSettings.updatedAt)
      };
    } catch (error) {
      console.error('Error upserting notification settings:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // Quiz methods
  async saveQuizResponse(quizResponse) {
    const session = this.driver.session();
    const id = nanoid();
    const now = new Date().toISOString();
    
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})
         CREATE (q:QuizResponse {
           id: $id,
           userId: $userId,
           responses: $responses,
           result: $result,
           completedAt: $completedAt,
           createdAt: $now,
           updatedAt: $now
         })
         CREATE (u)-[:TOOK_QUIZ]->(q)
         RETURN q`,
        { 
          ...quizResponse, 
          id, 
          responses: JSON.stringify(quizResponse.responses),
          result: JSON.stringify(quizResponse.result),
          completedAt: quizResponse.completedAt.toISOString(),
          now 
        }
      );
      
      const savedQuiz = result.records[0].get('q').properties;
      return {
        ...savedQuiz,
        responses: JSON.parse(savedQuiz.responses),
        result: JSON.parse(savedQuiz.result),
        completedAt: new Date(savedQuiz.completedAt),
        createdAt: new Date(savedQuiz.createdAt),
        updatedAt: new Date(savedQuiz.updatedAt)
      };
    } catch (error) {
      console.error('Error saving quiz response:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  async getQuizResponses(userId) {
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[:TOOK_QUIZ]->(q:QuizResponse)
         RETURN q
         ORDER BY q.completedAt DESC`,
        { userId }
      );
      
      return result.records.map(record => {
        const quiz = record.get('q').properties;
        return {
          ...quiz,
          responses: JSON.parse(quiz.responses),
          result: JSON.parse(quiz.result),
          completedAt: new Date(quiz.completedAt),
          createdAt: new Date(quiz.createdAt),
          updatedAt: new Date(quiz.updatedAt)
        };
      });
    } catch (error) {
      console.error('Error getting quiz responses:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
  
  // Recommendation methods
  async getRecommendations(userId, loveLanguage, limit = 3) {
    const session = this.driver.session();
    try {
      // Get user's liked and disliked actions to improve recommendations
      const userPreferences = await session.run(
        `MATCH (u:User {id: $userId})-[:CREATED]->(a:Action)
         WHERE a.likeStatus IN ['liked', 'disliked']
         RETURN a.description, a.likeStatus`,
        { userId }
      );
      
      const likedPhrases = userPreferences.records
        .filter(record => record.get('a.likeStatus') === 'liked')
        .map(record => record.get('a.description').toLowerCase());
      
      const dislikedPhrases = userPreferences.records
        .filter(record => record.get('a.likeStatus') === 'disliked')
        .map(record => record.get('a.description').toLowerCase());
      
      // Get actions that match the love language and aren't already created by the user
      let query = `
        MATCH (a:Action)
        WHERE a.loveLanguage = $loveLanguage 
        AND NOT EXISTS {
          MATCH (u:User {id: $userId})-[:CREATED]->(a)
        }
        AND NOT EXISTS {
          MATCH (u:User {id: $userId})-[:SCHEDULED]->(:ScheduledAction)-[:FOR_ACTION]->(a)
        }
      `;
      
      // Add preference filtering if we have preferences
      if (likedPhrases.length > 0 || dislikedPhrases.length > 0) {
        query += 'WITH a, ';
        
        // Add similarity score calculation based on liked and disliked phrases
        if (likedPhrases.length > 0) {
          const likedPhrasesParam = likedPhrases.map((_, i) => `$likedPhrase${i}`).join(', ');
          query += `[${likedPhrasesParam}] AS likedPhrases, `;
        } else {
          query += '[] AS likedPhrases, ';
        }
        
        if (dislikedPhrases.length > 0) {
          const dislikedPhrasesParam = dislikedPhrases.map((_, i) => `$dislikedPhrase${i}`).join(', ');
          query += `[${dislikedPhrasesParam}] AS dislikedPhrases, `;
        } else {
          query += '[] AS dislikedPhrases, ';
        }
        
        query += `
          REDUCE(score = 0.0, phrase IN likedPhrases | 
            CASE WHEN toLower(a.description) CONTAINS phrase 
            THEN score + 1.0 ELSE score END
          ) AS likeScore,
          REDUCE(score = 0.0, phrase IN dislikedPhrases | 
            CASE WHEN toLower(a.description) CONTAINS phrase 
            THEN score + 1.0 ELSE score END
          ) AS dislikeScore,
          a.isCustom AS isCustom
        `;
        
        // Order by recommendation score, prioritizing custom actions less
        query += `
          WITH a, (likeScore - dislikeScore - CASE WHEN isCustom THEN 0.2 ELSE 0 END) AS recommendationScore
          ORDER BY recommendationScore DESC, rand()
        `;
      } else {
        // Without preferences, just return random actions
        query += 'ORDER BY rand()';
      }
      
      query += `LIMIT $limit RETURN a`;
      
      // Build parameters for the query
      const params = { userId, loveLanguage, limit };
      likedPhrases.forEach((phrase, i) => {
        params[`likedPhrase${i}`] = phrase;
      });
      dislikedPhrases.forEach((phrase, i) => {
        params[`dislikedPhrase${i}`] = phrase;
      });
      
      const result = await session.run(query, params);
      
      return result.records.map(record => {
        const action = record.get('a').properties;
        return {
          ...action,
          createdAt: new Date(action.createdAt),
          updatedAt: new Date(action.updatedAt)
        };
      });
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    } finally {
      await session.close();
    }
  }
}

// In-memory fallback storage for development/testing
export class MemStorage extends IStorage {
  constructor() {
    super();
    this.users = new Map();
    this.actions = new Map();
    this.scheduledActions = new Map();
    this.notificationSettings = new Map();
    this.quizResponses = new Map();
  }
  
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  
  async upsertUser(userData) {
    const now = new Date();
    let user = this.users.get(userData.id);
    
    if (user) {
      user = {
        ...user,
        ...userData,
        partnerName: userData.partnerName ?? user.partnerName,
        primaryLoveLanguage: userData.primaryLoveLanguage ?? user.primaryLoveLanguage,
        updatedAt: now
      };
    } else {
      user = {
        ...userData,
        createdAt: now,
        updatedAt: now
      };
    }
    
    this.users.set(userData.id, user);
    return user;
  }
  
  // Actions methods
  async getActions(userId) {
    return Array.from(this.actions.values())
      .filter(action => action.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  
  async getActionById(id) {
    return this.actions.get(id);
  }
  
  async createAction(action) {
    const id = nanoid();
    const now = new Date();
    const newAction = {
      ...action,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.actions.set(id, newAction);
    return newAction;
  }
  
  async updateAction(id, action) {
    const existingAction = this.actions.get(id);
    
    if (!existingAction) {
      return undefined;
    }
    
    const updatedAction = {
      ...existingAction,
      ...action,
      updatedAt: new Date()
    };
    
    this.actions.set(id, updatedAction);
    return updatedAction;
  }
  
  async deleteAction(id) {
    return this.actions.delete(id);
  }
  
  async rateAction(id, likeStatus) {
    const existingAction = this.actions.get(id);
    
    if (!existingAction) {
      return undefined;
    }
    
    const updatedAction = {
      ...existingAction,
      likeStatus,
      updatedAt: new Date()
    };
    
    this.actions.set(id, updatedAction);
    return updatedAction;
  }
  
  // Scheduled Actions methods
  async getScheduledActions(userId) {
    const actions = Array.from(this.scheduledActions.values())
      .filter(scheduledAction => scheduledAction.userId === userId)
      .sort((a, b) => a.scheduledDate - b.scheduledDate);
    
    return actions.map(scheduledAction => ({
      ...scheduledAction,
      action: this.actions.get(scheduledAction.actionId)
    }));
  }
  
  async getScheduledActionById(id) {
    const scheduledAction = this.scheduledActions.get(id);
    
    if (!scheduledAction) {
      return undefined;
    }
    
    return {
      ...scheduledAction,
      action: this.actions.get(scheduledAction.actionId)
    };
  }
  
  async createScheduledAction(scheduledAction) {
    const id = nanoid();
    const now = new Date();
    const newScheduledAction = {
      ...scheduledAction,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.scheduledActions.set(id, newScheduledAction);
    
    return {
      ...newScheduledAction,
      action: this.actions.get(scheduledAction.actionId)
    };
  }
  
  async updateScheduledAction(id, scheduledAction) {
    const existingScheduledAction = this.scheduledActions.get(id);
    
    if (!existingScheduledAction) {
      return undefined;
    }
    
    const updatedScheduledAction = {
      ...existingScheduledAction,
      ...scheduledAction,
      updatedAt: new Date()
    };
    
    this.scheduledActions.set(id, updatedScheduledAction);
    
    return {
      ...updatedScheduledAction,
      action: this.actions.get(updatedScheduledAction.actionId)
    };
  }
  
  async deleteScheduledAction(id) {
    return this.scheduledActions.delete(id);
  }
  
  // Notification Settings methods
  async getNotificationSettings(userId) {
    return this.notificationSettings.get(userId);
  }
  
  async upsertNotificationSettings(settings) {
    const now = new Date();
    const id = nanoid();
    let notificationSettings = this.notificationSettings.get(settings.userId);
    
    if (notificationSettings) {
      notificationSettings = {
        ...notificationSettings,
        ...settings,
        updatedAt: now
      };
    } else {
      notificationSettings = {
        ...settings,
        id,
        createdAt: now,
        updatedAt: now
      };
    }
    
    this.notificationSettings.set(settings.userId, notificationSettings);
    return notificationSettings;
  }
  
  // Quiz methods
  async saveQuizResponse(quizResponse) {
    const id = nanoid();
    const now = new Date();
    const newQuiz = {
      ...quizResponse,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    // Group by userId for easier retrieval
    const userQuizzes = this.quizResponses.get(quizResponse.userId) || [];
    userQuizzes.push(newQuiz);
    this.quizResponses.set(quizResponse.userId, userQuizzes);
    
    return newQuiz;
  }
  
  async getQuizResponses(userId) {
    const userQuizzes = this.quizResponses.get(userId) || [];
    return userQuizzes.sort((a, b) => b.completedAt - a.completedAt);
  }
  
  // Recommendation methods
  async getRecommendations(userId, loveLanguage, limit = 3) {
    // Get all actions with the specified love language
    const matchingActions = Array.from(this.actions.values())
      .filter(action => action.loveLanguage === loveLanguage);
    
    // Filter out actions already created by the user
    const userActionIds = new Set(
      Array.from(this.actions.values())
        .filter(action => action.userId === userId)
        .map(action => action.id)
    );
    
    // Filter out actions already scheduled by the user
    const userScheduledActionIds = new Set(
      Array.from(this.scheduledActions.values())
        .filter(sa => sa.userId === userId)
        .map(sa => sa.actionId)
    );
    
    const availableActions = matchingActions.filter(
      action => !userActionIds.has(action.id) && !userScheduledActionIds.has(action.id)
    );
    
    // Get user's preferences for better recommendations
    const userPreferences = Array.from(this.actions.values())
      .filter(action => action.userId === userId && (action.likeStatus === 'liked' || action.likeStatus === 'disliked'));
    
    if (userPreferences.length > 0) {
      // Extract keywords from liked and disliked actions
      const likedKeywords = new Set();
      const dislikedKeywords = new Set();
      
      userPreferences.forEach(action => {
        const words = action.description.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.length > 3) {  // Only consider significant words
            if (action.likeStatus === 'liked') {
              likedKeywords.add(word);
            } else {
              dislikedKeywords.add(word);
            }
          }
        });
      });
      
      // Score actions based on keyword matches
      const scoredActions = availableActions.map(action => {
        const words = action.description.toLowerCase().split(/\s+/);
        let likeScore = 0;
        let dislikeScore = 0;
        
        words.forEach(word => {
          if (likedKeywords.has(word)) likeScore++;
          if (dislikedKeywords.has(word)) dislikeScore++;
        });
        
        // Custom actions are given slight penalty to favor pre-defined actions
        const customPenalty = action.isCustom ? 0.2 : 0;
        
        return {
          action,
          score: likeScore - dislikeScore - customPenalty
        };
      });
      
      // Sort by score and return top results
      scoredActions.sort((a, b) => b.score - a.score);
      return scoredActions.slice(0, limit).map(sa => sa.action);
    }
    
    // Without preferences, just return random actions
    return availableActions
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);
  }
}

// Export the appropriate storage implementation
const useNeo4j = process.env.USE_NEO4J === 'true';
export const storage = useNeo4j ? new Neo4jStorage() : new MemStorage();
