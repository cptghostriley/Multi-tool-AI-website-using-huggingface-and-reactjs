// Rate limiting middleware for API protection
const rateLimit = require('express-rate-limit');

// Demo mode check
const isDemoMode = process.env.DEMO_MODE === 'true';

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDemoMode ? 5 : 100, // limit each IP to 5 requests per windowMs in demo mode
  message: {
    error: isDemoMode 
      ? 'Demo rate limit exceeded. Please try again in 15 minutes.' 
      : 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// AI-specific rate limiting (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: isDemoMode ? 2 : 20, // Very limited in demo mode
  message: {
    error: isDemoMode 
      ? 'Demo AI usage limit reached. This is a demonstration version.' 
      : 'AI request limit exceeded. Please try again in 5 minutes.'
  }
});

module.exports = {
  apiLimiter,
  aiLimiter,
  isDemoMode
};
