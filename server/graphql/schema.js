export const schema = `
  type User {
    id: ID!
    email: String
    firstName: String
    lastName: String
    profileImageUrl: String
    partnerName: String
    primaryLoveLanguage: String
    createdAt: String!
    updatedAt: String!
  }
  
  type Action {
    id: ID!
    userId: ID!
    description: String!
    loveLanguage: String!
    tier: String!
    productLink: String
    isCustom: Boolean!
    likeStatus: String!
    createdAt: String!
    updatedAt: String!
  }
  
  type ScheduledAction {
    id: ID!
    userId: ID!
    actionId: ID!
    scheduledDate: String!
    completed: Boolean!
    isReminded: Boolean!
    action: Action
    createdAt: String!
    updatedAt: String!
  }
  
  type IntervalRange {
    min: Int!
    max: Int!
  }
  
  type NotificationSettings {
    id: ID!
    userId: ID!
    emailEnabled: Boolean!
    pushEnabled: Boolean!
    smsEnabled: Boolean!
    phoneNumber: String
    quickActionInterval: IntervalRange!
    mediumActionInterval: IntervalRange!
    specialActionInterval: IntervalRange!
    grandActionInterval: IntervalRange!
    createdAt: String!
    updatedAt: String!
  }
  
  type QuizResponse {
    id: ID!
    responses: [QuizAnswer!]!
    result: QuizResult!
    completedAt: String!
    createdAt: String!
    updatedAt: String!
  }
  
  type QuizAnswer {
    questionId: Int!
    answer: String!
    loveLanguage: String!
  }
  
  type QuizResult {
    primary: String!
    scores: ScoreMap!
  }
  
  scalar ScoreMap
  
  input ActionInput {
    description: String!
    loveLanguage: String!
    tier: String!
    productLink: String
  }
  
  input ScheduledActionInput {
    actionId: ID!
    scheduledDate: String!
  }
  
  input IntervalRangeInput {
    min: Int!
    max: Int!
  }
  
  input NotificationSettingsInput {
    emailEnabled: Boolean!
    pushEnabled: Boolean!
    smsEnabled: Boolean!
    phoneNumber: String
    quickActionInterval: IntervalRangeInput!
    mediumActionInterval: IntervalRangeInput!
    specialActionInterval: IntervalRangeInput!
    grandActionInterval: IntervalRangeInput!
  }
  
  input QuizResponseInput {
    responses: [QuizAnswerInput!]!
    result: QuizResultInput!
  }
  
  input QuizAnswerInput {
    questionId: Int!
    answer: String!
    loveLanguage: String!
  }
  
  input QuizResultInput {
    primary: String!
    scores: ScoreMapInput!
  }
  
  scalar ScoreMapInput
  
  type Query {
    me: User
    actions: [Action!]!
    action(id: ID!): Action
    recommendations(loveLanguage: String!, limit: Int): [Action!]!
    scheduledActions: [ScheduledAction!]!
    notificationSettings: NotificationSettings
    quizResponses: [QuizResponse!]!
  }
  
  type Mutation {
    updateProfile(partnerName: String, primaryLoveLanguage: String): User!
    createAction(action: ActionInput!): Action!
    rateAction(id: ID!, likeStatus: String!): Action!
    scheduleAction(input: ScheduledActionInput!): ScheduledAction!
    completeScheduledAction(id: ID!): ScheduledAction!
    updateNotificationSettings(settings: NotificationSettingsInput!): NotificationSettings!
    saveQuizResponse(input: QuizResponseInput!): QuizResponse!
  }
`;
