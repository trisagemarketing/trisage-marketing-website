export const CHAT_STEPS = {
  WELCOME: 0,
  INITIAL_PROMPT: 1,
  NAME: 2,
  EMAIL: 3,
  PHONE: 4,
  SERVICE: 5,
  MESSAGE: 6,
  SUBMITTING: 7,
  SUCCESS: 8,
  ERROR: 9,
} as const;

export const SERVICES_LIST = [
  "SEO & Geo-Targeting",
  "Performance Marketing",
  "Social Media Growth",
  "Revenue Management",
  "Full Digital Ecosystem",
];

export const BOT_AVATAR = "/logo.png"; // Standard Trisage Avatar

export const CHATBOT_MESSAGES = {
  WELCOME: "Hi there! 👋 Welcome to Trisage Marketing. How can I help you grow today?",
  ASK_NAME: "Great! I can connect you with the right expert. To get started, what's your name?",
  ASK_EMAIL: "Nice to meet you! What's the best email to reach you at?",
  ASK_PHONE: "Got it. And a phone number we can call you on?",
  ASK_SERVICE: "Thanks! What area are you looking to grow?",
  ASK_MESSAGE: "Awesome. Anything specific you'd like us to know before we hop on a call?",
  SUCCESS: "All set! 🎉 Our team will review your details and reach out shortly. Have a great day!",
  ERROR_GENERIC: "Oops! Something went wrong on our end. Please try again or reach out to us directly.",
  ERROR_RATE_LIMIT: "You're moving too fast! Please wait a moment before trying again.",
};
