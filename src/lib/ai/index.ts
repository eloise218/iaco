/**
 * AI Utilities Index
 * 
 * Central export point for all AI-related utilities.
 */

export { AI_CONFIG, getChatModel } from './config';
export { buildSystemPrompt } from './system-prompt';
export {
  formatMessagesForAI,
  validateMessage,
  truncateMessageHistory,
  sanitizeMessageContent,
} from './message-formatting';
export {
  loadVideoCatalog,
  filterVideosByLevel,
  filterVideosByTopics,
  getRecommendedVideos,
  formatVideosAsMarkdown,
} from './video-catalog';
