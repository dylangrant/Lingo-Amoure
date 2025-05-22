import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  profileImageUrl: z.string().url().nullable(),
  partnerName: z.string().nullable(),
  primaryLoveLanguage: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const upsertUserSchema = userSchema.omit({ createdAt: true, updatedAt: true });

// Love languages enum
export const LOVE_LANGUAGES = {
  WORDS_OF_AFFIRMATION: "Words of Affirmation",
  ACTS_OF_SERVICE: "Acts of Service",
  RECEIVING_GIFTS: "Receiving Gifts",
  QUALITY_TIME: "Quality Time",
  PHYSICAL_TOUCH: "Physical Touch"
};

// Action tiers enum
export const ACTION_TIERS = {
  QUICK: {
    name: "Quick & Easy",
    defaultInterval: { min: 1, max: 5 }
  },
  MEDIUM: {
    name: "Medium Effort",
    defaultInterval: { min: 6, max: 14 }
  },
  SPECIAL: {
    name: "Special Occasion",
    defaultInterval: { min: 15, max: 30 }
  },
  GRAND: {
    name: "Grand Gesture",
    defaultInterval: { min: 31, max: 90 }
  }
};

// Action schema
export const actionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  description: z.string(),
  loveLanguage: z.enum([
    LOVE_LANGUAGES.WORDS_OF_AFFIRMATION,
    LOVE_LANGUAGES.ACTS_OF_SERVICE,
    LOVE_LANGUAGES.RECEIVING_GIFTS,
    LOVE_LANGUAGES.QUALITY_TIME,
    LOVE_LANGUAGES.PHYSICAL_TOUCH
  ]),
  tier: z.enum([
    ACTION_TIERS.QUICK.name,
    ACTION_TIERS.MEDIUM.name,
    ACTION_TIERS.SPECIAL.name,
    ACTION_TIERS.GRAND.name
  ]),
  productLink: z.string().url().nullable(),
  isCustom: z.boolean().default(false),
  likeStatus: z.enum(['liked', 'disliked', 'neutral']).default('neutral'),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertActionSchema = actionSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Scheduled action schema
export const scheduledActionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  actionId: z.string(),
  scheduledDate: z.date(),
  completed: z.boolean().default(false),
  isReminded: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertScheduledActionSchema = scheduledActionSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Notification settings schema
export const notificationSettingsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  emailEnabled: z.boolean().default(true),
  pushEnabled: z.boolean().default(true),
  smsEnabled: z.boolean().default(false),
  phoneNumber: z.string().nullable(),
  quickActionInterval: z.object({
    min: z.number(),
    max: z.number()
  }).default(ACTION_TIERS.QUICK.defaultInterval),
  mediumActionInterval: z.object({
    min: z.number(),
    max: z.number()
  }).default(ACTION_TIERS.MEDIUM.defaultInterval),
  specialActionInterval: z.object({
    min: z.number(),
    max: z.number()
  }).default(ACTION_TIERS.SPECIAL.defaultInterval),
  grandActionInterval: z.object({
    min: z.number(),
    max: z.number()
  }).default(ACTION_TIERS.GRAND.defaultInterval),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const upsertNotificationSettingsSchema = notificationSettingsSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Quiz response schema
export const quizResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  responses: z.array(z.object({
    questionId: z.number(),
    answer: z.string(),
    loveLanguage: z.enum([
      LOVE_LANGUAGES.WORDS_OF_AFFIRMATION,
      LOVE_LANGUAGES.ACTS_OF_SERVICE,
      LOVE_LANGUAGES.RECEIVING_GIFTS,
      LOVE_LANGUAGES.QUALITY_TIME,
      LOVE_LANGUAGES.PHYSICAL_TOUCH
    ])
  })),
  result: z.object({
    primary: z.string(),
    scores: z.record(z.number())
  }),
  completedAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const insertQuizResponseSchema = quizResponseSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// Types
export const User = userSchema;
export const Action = actionSchema;
export const ScheduledAction = scheduledActionSchema;
export const NotificationSettings = notificationSettingsSchema;
export const QuizResponse = quizResponseSchema;
