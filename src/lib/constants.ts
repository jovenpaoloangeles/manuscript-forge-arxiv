// ============================================
// Storage Keys
// ============================================
export const STORAGE_KEYS = {
  OPENAI_API_KEY: "openai-api-key",
  ACADEMIC_PAPER_SESSIONS: "academic-paper-sessions",
} as const;

// ============================================
// OpenAI Configuration
// ============================================
export const OPENAI_CONFIG = {
  MODEL: "gpt-4.1-2025-04-14",
  TEMPERATURE: {
    DEFAULT: 0.7,
    TITLE_SUGGESTION: 0.8,
  },
  MAX_TOKENS: {
    SECTION_CONTENT: 1000,
    CAPTION: 150,
    ABSTRACT: 400,
    TITLE_SUGGESTION: 300,
    TEXT_REWRITE: 500,
  },
} as const;

// ============================================
// Session Management
// ============================================
export const SESSION_CONFIG = {
  ID_PREFIX: "session-",
  DEFAULT_NAME_FORMAT: "Session {timestamp}",
} as const;

// ============================================
// Default Messages and Formats
// ============================================
export const DEFAULT_MESSAGES = {
  NO_CONTENT_AVAILABLE: "No content available yet.",
  PAPER_TITLE_PLACEHOLDER: "Academic Research Paper",
} as const;

// ============================================
// Toast Messages
// ============================================
export const TOAST_MESSAGES = {
  API_KEY_REQUIRED: {
    title: "API key required",
    description: "Please enter your OpenAI API key to generate content.",
  },
  GENERATION_FAILED: {
    title: "Generation failed",
    description: "Failed to {operation}. Please check your API key and try again.",
  },
  CONTENT_GENERATED: {
    title: "Content generated",
    description: "Generated academic content for {sectionTitle}",
  },
  CAPTION_GENERATED: {
    title: "Caption generated",
    description: "Figure caption has been generated successfully.",
  },
  ABSTRACT_GENERATED: {
    title: "Abstract generated",
    description: "Abstract has been generated based on the full paper content.",
  },
  TITLES_SUGGESTED: {
    title: "Titles suggested",
    description: "Generated {count} alternative titles.",
  },
  SESSION_SAVED: {
    title: "Session saved",
    description: "Session \"{name}\" has been saved successfully.",
  },
  SESSION_LOADED: {
    title: "Session loaded",
    description: "Session \"{name}\" has been loaded.",
  },
  SESSION_DELETED: {
    title: "Session deleted",
    description: "Session has been deleted successfully.",
  },
} as const;

// ============================================
// Citation Format
// ============================================
export const CITATION_FORMAT = {
  PLACEHOLDER: "[CITE: {reason}]",
  PLACEHOLDER_REGEX: /\[CITE:\s*([^\]]+)\]/g,
} as const;

// ============================================
// Section Types
// ============================================
export const SECTION_TYPES = {
  ABSTRACT: "abstract",
  INTRODUCTION: "introduction", 
  METHODOLOGY: "methodology",
  RESULTS: "results",
  DISCUSSION: "discussion",
  CONCLUSION: "conclusion",
} as const;