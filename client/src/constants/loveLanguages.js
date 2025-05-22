export const LOVE_LANGUAGES = {
  WORDS_OF_AFFIRMATION: "Words of Affirmation",
  ACTS_OF_SERVICE: "Acts of Service",
  RECEIVING_GIFTS: "Receiving Gifts",
  QUALITY_TIME: "Quality Time",
  PHYSICAL_TOUCH: "Physical Touch"
};

export const LOVE_LANGUAGE_OPTIONS = [
  { label: "Words of Affirmation", value: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION },
  { label: "Acts of Service", value: LOVE_LANGUAGES.ACTS_OF_SERVICE },
  { label: "Receiving Gifts", value: LOVE_LANGUAGES.RECEIVING_GIFTS },
  { label: "Quality Time", value: LOVE_LANGUAGES.QUALITY_TIME },
  { label: "Physical Touch", value: LOVE_LANGUAGES.PHYSICAL_TOUCH }
];

export const ACTION_TIERS = {
  QUICK: {
    label: "Quick & Easy (1-5 days)",
    value: "Quick & Easy",
    defaultInterval: { min: 1, max: 5 }
  },
  MEDIUM: {
    label: "Medium Effort (6-14 days)",
    value: "Medium Effort",
    defaultInterval: { min: 6, max: 14 }
  },
  SPECIAL: {
    label: "Special Occasion (15-30 days)",
    value: "Special Occasion",
    defaultInterval: { min: 15, max: 30 }
  },
  GRAND: {
    label: "Grand Gesture (31+ days)",
    value: "Grand Gesture",
    defaultInterval: { min: 31, max: 90 }
  }
};

export const ACTION_TIER_OPTIONS = [
  { label: ACTION_TIERS.QUICK.label, value: ACTION_TIERS.QUICK.value },
  { label: ACTION_TIERS.MEDIUM.label, value: ACTION_TIERS.MEDIUM.value },
  { label: ACTION_TIERS.SPECIAL.label, value: ACTION_TIERS.SPECIAL.value },
  { label: ACTION_TIERS.GRAND.label, value: ACTION_TIERS.GRAND.value }
];

export const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "What would make your partner feel most appreciated?",
    answers: [
      {
        text: "When I surprise them with a thoughtful gift, even something small.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "When I take care of a task they've been meaning to do.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "When I tell them specifically what I admire about them.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "When I put my phone away and give them my full attention.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "When I hold their hand or give them a hug unexpectedly.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      }
    ]
  },
  {
    id: 2,
    question: "When your partner is feeling down, they would most likely appreciate:",
    answers: [
      {
        text: "Spending uninterrupted time together doing something they enjoy.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "Receiving a small gift that shows you were thinking of them.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "Physical affection like a hug or back rub.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      },
      {
        text: "Hearing you say how much they mean to you.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "Having you take over their responsibilities for the day.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      }
    ]
  },
  {
    id: 3,
    question: "Your partner would be most excited about:",
    answers: [
      {
        text: "A handwritten card expressing your feelings for them.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "A weekend getaway where you can spend quality time together.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "A thoughtful gift that you put effort into selecting.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "A massage or physical display of affection.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      },
      {
        text: "You completing a project around the house they've wanted done.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      }
    ]
  },
  {
    id: 4,
    question: "Your partner would be most likely to complain about:",
    answers: [
      {
        text: "You not helping enough with everyday tasks.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "You being physically distant or not showing affection.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      },
      {
        text: "You not expressing appreciation or saying 'I love you' often.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "You forgetting special occasions or not giving thoughtful gifts.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "You being distracted during conversations or time together.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      }
    ]
  },
  {
    id: 5,
    question: "In daily life, your partner most appreciates:",
    answers: [
      {
        text: "Small tokens of affection like their favorite snack or flowers.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "Frequent physical touch like hand-holding or hugs.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      },
      {
        text: "Regular verbal affirmation and compliments.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "You taking initiative on household tasks without being asked.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "Setting aside time each day to talk without distractions.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      }
    ]
  },
  {
    id: 6,
    question: "Your partner feels most connected to you when:",
    answers: [
      {
        text: "You do something practical to make their day easier.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "You have deep, meaningful conversations together.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "You express how much you value and appreciate them.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "You give them a meaningful or thoughtful gift.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "You're physically close or intimate with them.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      }
    ]
  },
  {
    id: 7,
    question: "What would your partner most appreciate on their birthday?",
    answers: [
      {
        text: "A day spent doing activities together that they enjoy.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "A heartfelt letter or card expressing your love.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "Taking care of all their responsibilities for the day.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "A thoughtful, personal gift they've been wanting.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "Extra physical affection and intimacy throughout the day.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      }
    ]
  },
  {
    id: 8,
    question: "After a disagreement, your partner would most likely want you to:",
    answers: [
      {
        text: "Give them a hug and physical reassurance.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      },
      {
        text: "Do something nice for them to show you care.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "Spend time together reconnecting emotionally.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "Express your feelings and apologize with sincere words.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "Give them a small gift as a peace offering.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      }
    ]
  },
  {
    id: 9,
    question: "Your partner would feel most valued if you:",
    answers: [
      {
        text: "Regularly tell them how amazing they are and how much you love them.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "Regularly give them small gifts or tokens of appreciation.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "Regularly set aside quality time just for them.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "Regularly help them with their daily tasks.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "Regularly show physical affection throughout the day.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      }
    ]
  },
  {
    id: 10,
    question: "What would your partner consider most meaningful?",
    answers: [
      {
        text: "A surprise weekend away where you can focus on each other.",
        loveLanguage: LOVE_LANGUAGES.QUALITY_TIME
      },
      {
        text: "A custom or personalized gift that reminds them of a special memory.",
        loveLanguage: LOVE_LANGUAGES.RECEIVING_GIFTS
      },
      {
        text: "When you help them achieve an important goal or task.",
        loveLanguage: LOVE_LANGUAGES.ACTS_OF_SERVICE
      },
      {
        text: "Public recognition or praise of their accomplishments.",
        loveLanguage: LOVE_LANGUAGES.WORDS_OF_AFFIRMATION
      },
      {
        text: "Physical closeness and affection, especially during difficult times.",
        loveLanguage: LOVE_LANGUAGES.PHYSICAL_TOUCH
      }
    ]
  }
];
