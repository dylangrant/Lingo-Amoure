import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a readable string
 * @param {Date} date
 * @param {Object} options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    weekday: undefined,
    year: undefined,
    month: 'short',
    day: 'numeric',
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  return new Date(date).toLocaleDateString(undefined, mergedOptions);
}

/**
 * Generates a random number between min and max (inclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Gets the color class for a love language
 * @param {string} loveLanguage
 * @returns {string}
 */
export function getLoveLanguageColor(loveLanguage) {
  switch (loveLanguage) {
    case 'Words of Affirmation':
      return 'bg-accent';
    case 'Acts of Service':
      return 'bg-primary';
    case 'Receiving Gifts':
      return 'bg-secondary';
    case 'Quality Time':
      return 'bg-accent-dark';
    case 'Physical Touch':
      return 'bg-primary-dark';
    default:
      return 'bg-neutral-medium';
  }
}

/**
 * Gets the icon name for a love language
 * @param {string} loveLanguage
 * @returns {string}
 */
export function getLoveLanguageIcon(loveLanguage) {
  switch (loveLanguage) {
    case 'Words of Affirmation':
      return 'chat';
    case 'Acts of Service':
      return 'home_repair_service';
    case 'Receiving Gifts':
      return 'card_giftcard';
    case 'Quality Time':
      return 'timer';
    case 'Physical Touch':
      return 'favorite';
    default:
      return 'help';
  }
}

/**
 * Gets effort text and duration for a tier
 * @param {string} tier
 * @returns {{ effortText: string, duration: string }}
 */
export function getTierInfo(tier) {
  switch (tier) {
    case 'Quick & Easy':
      return { effortText: 'Easy', duration: '30 min' };
    case 'Medium Effort':
      return { effortText: 'Medium', duration: '2 hours' };
    case 'Special Occasion':
      return { effortText: 'Special', duration: '1 day' };
    case 'Grand Gesture':
      return { effortText: 'Grand', duration: '$$$$' };
    default:
      return { effortText: '', duration: '' };
  }
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
