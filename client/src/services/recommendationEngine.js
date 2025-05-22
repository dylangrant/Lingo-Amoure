import { LOVE_LANGUAGES, ACTION_TIERS } from "@/constants/loveLanguages";

// Sample action database - in a real app, this would come from a backend API
// Each action has:
// - id: unique identifier
// - title: brief description of the action
// - description: more detailed explanation (optional)
// - loveLanguage: which of the 5 love languages this corresponds to
// - tier: the tier this action belongs to (quick, medium, special, grand)
// - forPartnerGender: 'male', 'female', or 'any'
// - tags: array of tags for filtering (optional)
// - likeCount: number of likes from users (used for recommendations)
// - dislikeCount: number of dislikes from users (used for recommendations)

const ACTION_DATABASE = [
  // Words of Affirmation Actions
  {
    id: "wa-1",
    title: "Send a thoughtful morning text",
    description: "Start their day with a message telling them what you appreciate about them.",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["text", "morning", "appreciation"],
    likeCount: 24,
    dislikeCount: 2
  },
  {
    id: "wa-2",
    title: "Leave a handwritten note",
    description: "Hide a note somewhere they'll find it during their day with words of encouragement.",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["note", "surprise", "encouragement"],
    likeCount: 18,
    dislikeCount: 3
  },
  {
    id: "wa-3",
    title: "Create a 'reasons I love you' jar",
    description: "Fill a jar with small notes listing reasons you love and appreciate them.",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["creative", "multiple", "lasting"],
    likeCount: 32,
    dislikeCount: 1
  },
  {
    id: "wa-4",
    title: "Write a heartfelt letter",
    description: "Take time to write a detailed letter expressing your feelings and gratitude.",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["letter", "detailed", "emotions"],
    likeCount: 15,
    dislikeCount: 2
  },
  {
    id: "wa-5",
    title: "Create a video montage with messages",
    description: "Compile video messages from friends and family saying what they appreciate about your partner.",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.SPECIAL.value,
    forPartnerGender: "any",
    tags: ["video", "friends", "family", "collaboration"],
    likeCount: 28,
    dislikeCount: 3
  },
  {
    id: "wa-6",
    title: "Public acknowledgment",
    description: "Recognize your partner's achievements or qualities publicly (social media, gathering, etc).",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["public", "acknowledgment", "social"],
    likeCount: 12,
    dislikeCount: 8
  },
  {
    id: "wa-7",
    title: "Anniversary letter journey",
    description: "Create a series of letters to be opened on specific dates throughout the year.",
    loveLanguage: "WORDS_OF_AFFIRMATION",
    tier: ACTION_TIERS.GRAND.value,
    forPartnerGender: "any",
    tags: ["anniversary", "letters", "longterm"],
    likeCount: 19,
    dislikeCount: 2
  },
  
  // Acts of Service Actions
  {
    id: "as-1",
    title: "Take over a chore they dislike",
    description: "Do one of their regular chores without them asking.",
    loveLanguage: "ACTS_OF_SERVICE",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["chores", "help", "daily"],
    likeCount: 22,
    dislikeCount: 1
  },
  {
    id: "as-2",
    title: "Prepare breakfast in bed",
    description: "Surprise them with their favorite breakfast before they start their day.",
    loveLanguage: "ACTS_OF_SERVICE",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["food", "morning", "surprise"],
    likeCount: 26,
    dislikeCount: 4
  },
  {
    id: "as-3",
    title: "Create a relaxing bath",
    description: "Set up a bath with candles, bath bombs, and their favorite music.",
    loveLanguage: "ACTS_OF_SERVICE",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["relaxation", "pampering", "evening"],
    likeCount: 18,
    dislikeCount: 3
  },
  {
    id: "as-4",
    title: "Organize a space that stresses them",
    description: "Clean and organize their desk, closet, or another area that's been causing them stress.",
    loveLanguage: "ACTS_OF_SERVICE",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["organization", "stress-relief", "home"],
    likeCount: 16,
    dislikeCount: 5
  },
  {
    id: "as-5",
    title: "Handle all responsibilities for a day",
    description: "Take on all household or childcare duties for an entire day so they can relax.",
    loveLanguage: "ACTS_OF_SERVICE",
    tier: ACTION_TIERS.SPECIAL.value,
    forPartnerGender: "any",
    tags: ["day-off", "comprehensive", "relaxation"],
    likeCount: 30,
    dislikeCount: 2
  },
  {
    id: "as-6",
    title: "Plan and execute a home improvement project",
    description: "Complete a home project they've been wanting but haven't had time for.",
    loveLanguage: "ACTS_OF_SERVICE",
    tier: ACTION_TIERS.GRAND.value,
    forPartnerGender: "any",
    tags: ["home-improvement", "project", "lasting"],
    likeCount: 14,
    dislikeCount: 3
  },
  
  // Receiving Gifts Actions
  {
    id: "rg-1",
    title: "Bring their favorite treat",
    description: "Surprise them with their favorite coffee, snack, or treat.",
    loveLanguage: "RECEIVING_GIFTS",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["food", "small", "surprise"],
    likeCount: 28,
    dislikeCount: 2
  },
  {
    id: "rg-2",
    title: "Send flowers to their workplace",
    description: "Have flowers delivered to their work to brighten their day.",
    loveLanguage: "RECEIVING_GIFTS",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["flowers", "work", "public"],
    likeCount: 16,
    dislikeCount: 6
  },
  {
    id: "rg-3",
    title: "Create a custom playlist",
    description: "Make a playlist of songs that remind you of them or have special meaning.",
    loveLanguage: "RECEIVING_GIFTS",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["music", "digital", "meaningful"],
    likeCount: 22,
    dislikeCount: 3
  },
  {
    id: "rg-4",
    title: "Find a book by their favorite author",
    description: "Get them a new or special edition book by an author they love.",
    loveLanguage: "RECEIVING_GIFTS",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["book", "hobby", "interest"],
    likeCount: 14,
    dislikeCount: 4
  },
  {
    id: "rg-5",
    title: "Purchase tickets to an event",
    description: "Get tickets to a concert, play, or sporting event they'd enjoy.",
    loveLanguage: "RECEIVING_GIFTS",
    tier: ACTION_TIERS.SPECIAL.value,
    forPartnerGender: "any",
    tags: ["event", "experience", "entertainment"],
    likeCount: 26,
    dislikeCount: 2
  },
  {
    id: "rg-6",
    title: "Commission custom artwork",
    description: "Have a piece of art created based on a meaningful photo or memory.",
    loveLanguage: "RECEIVING_GIFTS",
    tier: ACTION_TIERS.GRAND.value,
    forPartnerGender: "any",
    tags: ["art", "custom", "meaningful"],
    likeCount: 18,
    dislikeCount: 3
  },
  
  // Quality Time Actions
  {
    id: "qt-1",
    title: "Device-free dinner",
    description: "Have a meal together with no phones or other distractions.",
    loveLanguage: "QUALITY_TIME",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["dinner", "undistracted", "conversation"],
    likeCount: 24,
    dislikeCount: 2
  },
  {
    id: "qt-2",
    title: "Take a walk together",
    description: "Go for a walk and focus on conversation and connection.",
    loveLanguage: "QUALITY_TIME",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["outdoors", "exercise", "talking"],
    likeCount: 20,
    dislikeCount: 3
  },
  {
    id: "qt-3",
    title: "Plan a date night",
    description: "Organize an evening focused on activities you both enjoy.",
    loveLanguage: "QUALITY_TIME",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["date", "evening", "activities"],
    likeCount: 32,
    dislikeCount: 1
  },
  {
    id: "qt-4",
    title: "Take a class together",
    description: "Sign up for a class to learn something new together (cooking, dancing, etc).",
    loveLanguage: "QUALITY_TIME",
    tier: ACTION_TIERS.SPECIAL.value,
    forPartnerGender: "any",
    tags: ["learning", "activity", "skill"],
    likeCount: 18,
    dislikeCount: 5
  },
  {
    id: "qt-5",
    title: "Weekend getaway",
    description: "Plan a weekend trip to a destination you both would enjoy.",
    loveLanguage: "QUALITY_TIME",
    tier: ACTION_TIERS.GRAND.value,
    forPartnerGender: "any",
    tags: ["travel", "weekend", "experience"],
    likeCount: 28,
    dislikeCount: 2
  },
  
  // Physical Touch Actions
  {
    id: "pt-1",
    title: "Offer a hand massage",
    description: "Give them a hand massage while you talk about their day.",
    loveLanguage: "PHYSICAL_TOUCH",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["massage", "relaxation", "conversation"],
    likeCount: 22,
    dislikeCount: 3
  },
  {
    id: "pt-2",
    title: "Extended hug greeting",
    description: "Give a long, intentional hug when you or they arrive home.",
    loveLanguage: "PHYSICAL_TOUCH",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["hug", "greeting", "simple"],
    likeCount: 26,
    dislikeCount: 1
  },
  {
    id: "pt-3",
    title: "Cuddle during a movie",
    description: "Plan a movie night with intentional cuddling time.",
    loveLanguage: "PHYSICAL_TOUCH",
    tier: ACTION_TIERS.QUICK.value,
    forPartnerGender: "any",
    tags: ["cuddle", "movie", "relaxation"],
    likeCount: 30,
    dislikeCount: 2
  },
  {
    id: "pt-4",
    title: "Give a full back massage",
    description: "Learn some basic massage techniques and give them a proper back massage.",
    loveLanguage: "PHYSICAL_TOUCH",
    tier: ACTION_TIERS.MEDIUM.value,
    forPartnerGender: "any",
    tags: ["massage", "relaxation", "evening"],
    likeCount: 24,
    dislikeCount: 3
  },
  {
    id: "pt-5",
    title: "Take a dance class together",
    description: "Learn a partner dance style like salsa, tango, or ballroom.",
    loveLanguage: "PHYSICAL_TOUCH",
    tier: ACTION_TIERS.SPECIAL.value,
    forPartnerGender: "any",
    tags: ["dance", "learning", "activity"],
    likeCount: 18,
    dislikeCount: 6
  },
  {
    id: "pt-6",
    title: "Create a spa day at home",
    description: "Set up a full day of relaxing massages and spa treatments at home.",
    loveLanguage: "PHYSICAL_TOUCH",
    tier: ACTION_TIERS.GRAND.value,
    forPartnerGender: "any",
    tags: ["spa", "pampering", "relaxation"],
    likeCount: 20,
    dislikeCount: 4
  }
];

/**
 * Recommend actions based on partner preferences and user feedback
 * 
 * @param {Object} params - Parameters for generating recommendations
 * @param {string} params.primaryLoveLanguage - Partner's primary love language
 * @param {string} params.secondaryLoveLanguage - Partner's secondary love language (optional)
 * @param {string} params.partnerGender - Partner's gender (male, female, or left empty for any)
 * @param {Array} params.previouslySelectedActions - IDs of previously selected actions (to avoid repeats)
 * @param {Object} params.userFeedback - IDs of actions with user feedback (like/dislike)
 * @param {number} params.count - Number of recommendations to return
 * @returns {Array} - Array of recommended actions
 */
export function getRecommendedActions({
  primaryLoveLanguage,
  secondaryLoveLanguage = null,
  partnerGender = "",
  previouslySelectedActions = [],
  userFeedback = {},
  count = 6
}) {
  // Filter actions that match the partner's gender (or are gender-neutral)
  let filteredActions = ACTION_DATABASE.filter(action => 
    action.forPartnerGender === "any" || !partnerGender || action.forPartnerGender === partnerGender
  );
  
  // Remove previously selected actions to avoid repetition
  filteredActions = filteredActions.filter(action => 
    !previouslySelectedActions.includes(action.id)
  );
  
  // Score actions based on love language match and user feedback
  const scoredActions = filteredActions.map(action => {
    let score = 0;
    
    // Prioritize primary love language
    if (action.loveLanguage === primaryLoveLanguage) {
      score += 5;
    }
    
    // Consider secondary love language with less weight
    if (secondaryLoveLanguage && action.loveLanguage === secondaryLoveLanguage) {
      score += 2;
    }
    
    // Adjust score based on like/dislike ratio from global data
    const likeRatio = action.likeCount / (action.likeCount + action.dislikeCount);
    score += likeRatio * 3;
    
    // Incorporate user's personal feedback
    if (userFeedback[action.id] === 'like') {
      score += 2;
      
      // Boost similar actions
      if (action.tags) {
        action.tags.forEach(tag => {
          score += 0.2; // Small boost for each matching tag
        });
      }
    } else if (userFeedback[action.id] === 'dislike') {
      score -= 3;
      
      // Penalize similar actions
      if (action.tags) {
        action.tags.forEach(tag => {
          score -= 0.3; // Small penalty for each matching tag
        });
      }
    }
    
    return { ...action, score };
  });
  
  // Sort actions by score (highest first)
  const sortedActions = scoredActions.sort((a, b) => b.score - a.score);
  
  // Return the top N recommendations with balanced tiers
  const quickActions = sortedActions
    .filter(action => action.tier === ACTION_TIERS.QUICK.value)
    .slice(0, Math.ceil(count * 0.5)); // 50% quick actions
    
  const mediumActions = sortedActions
    .filter(action => action.tier === ACTION_TIERS.MEDIUM.value)
    .slice(0, Math.ceil(count * 0.3)); // 30% medium actions
    
  const specialActions = sortedActions
    .filter(action => action.tier === ACTION_TIERS.SPECIAL.value)
    .slice(0, Math.ceil(count * 0.15)); // 15% special actions
    
  const grandActions = sortedActions
    .filter(action => action.tier === ACTION_TIERS.GRAND.value)
    .slice(0, Math.ceil(count * 0.05)); // 5% grand actions
  
  // Combine the tiered actions and sort by score again
  const tieredRecommendations = [...quickActions, ...mediumActions, ...specialActions, ...grandActions]
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
  
  return tieredRecommendations;
}

/**
 * Record user feedback on an action recommendation
 * In a real app, this would save to a backend API
 * 
 * @param {string} actionId - ID of the action receiving feedback
 * @param {string} feedback - 'like' or 'dislike'
 * @param {Object} userFeedback - Current user feedback object
 * @returns {Object} - Updated user feedback object
 */
export function recordActionFeedback(actionId, feedback, userFeedback = {}) {
  const updatedFeedback = { ...userFeedback };
  updatedFeedback[actionId] = feedback;
  
  // In a real app, this would make an API call to update the database
  // localStorage is used here for demo purposes only
  localStorage.setItem('lovelingoUserFeedback', JSON.stringify(updatedFeedback));
  
  return updatedFeedback;
}

/**
 * Get all available actions for a specific love language
 * Useful for browsing all possible actions by category
 * 
 * @param {string} loveLanguage - The love language to filter by
 * @returns {Array} - Array of actions for the specified love language
 */
export function getActionsByLoveLanguage(loveLanguage) {
  return ACTION_DATABASE.filter(action => action.loveLanguage === loveLanguage);
}

/**
 * Get all available actions for a specific tier
 * Useful for browsing all possible actions by effort level
 * 
 * @param {string} tier - The tier to filter by
 * @returns {Array} - Array of actions for the specified tier
 */
export function getActionsByTier(tier) {
  return ACTION_DATABASE.filter(action => action.tier === tier);
}

/**
 * Add a custom action to the action database
 * In a real app, this would save to a backend API
 * 
 * @param {Object} action - The custom action to add
 * @returns {Array} - Updated action database
 */
export function addCustomAction(action) {
  // Generate a unique ID for the custom action
  const customId = `custom-${Date.now()}`;
  
  // Create a new action with default values for missing fields
  const newAction = {
    id: customId,
    likeCount: 1, // Start with one like (from the creator)
    dislikeCount: 0,
    forPartnerGender: "any",
    ...action
  };
  
  // In a real app, this would make an API call to update the database
  // Here we'll just update our in-memory database and store in localStorage
  const customActions = JSON.parse(localStorage.getItem('lovelingoCustomActions') || '[]');
  customActions.push(newAction);
  localStorage.setItem('lovelingoCustomActions', JSON.stringify(customActions));
  
  return [...ACTION_DATABASE, newAction];
}

// Export the full database for admin or development use
export const getFullActionDatabase = () => {
  const customActions = JSON.parse(localStorage.getItem('lovelingoCustomActions') || '[]');
  return [...ACTION_DATABASE, ...customActions];
};