const express = require('express');
const Joi = require('joi');
const { authenticateToken } = require('../middleware/auth');
const { pool } = require('../config/database');
const { generateText, generateImage, generateVoice } = require('../services/ai');

const router = express.Router();

// Validation schemas
const textGenerationSchema = Joi.object({
  prompt: Joi.string().min(1).max(1000).required(),
  model: Joi.string().valid('gpt-3.5-turbo', 'gpt-4').default('gpt-3.5-turbo'),
  maxTokens: Joi.number().min(1).max(4000).default(500)
});

const imageGenerationSchema = Joi.object({
  prompt: Joi.string().min(1).max(1000).required(),
  size: Joi.string().valid('256x256', '512x512', '1024x1024').default('512x512'),
  style: Joi.string().valid('realistic', 'artistic', 'cartoon').default('realistic')
});

const voiceGenerationSchema = Joi.object({
  text: Joi.string().min(1).max(1000).required(),
  voice: Joi.string().valid('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer').default('alloy'),
  model: Joi.string().valid('eleven_monolingual_v1', 'eleven_multilingual_v1').default('eleven_monolingual_v1')
});

// Helper function to log activity (optional user)
const logActivity = async (userId, toolType, inputData, outputData) => {
  try {
    if (userId && process.env.DATABASE_URL) {
      await pool.query(
        'INSERT INTO user_activity (user_id, tool_type, input_data, output_data) VALUES ($1, $2, $3, $4)',
        [userId, toolType, JSON.stringify(inputData), JSON.stringify(outputData)]
      );
    }
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    // If token is provided, try to authenticate
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // If token is invalid, continue without user
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

// Text-to-Text Generation
router.post('/text', optionalAuth, async (req, res) => {
  try {
    const { error, value } = textGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, model, maxTokens } = value;

    // Generate text using AI service
    const result = await generateText(prompt, model, maxTokens);

    // Log activity (only if user is authenticated)
    if (req.user) {
      await logActivity(req.user.id, 'text_generation', { prompt, model, maxTokens }, { result });
    }

    res.json({
      success: true,
      data: {
        prompt,
        generatedText: result,
        model,
        maxTokens
      }
    });
  } catch (error) {
    console.error('Text generation error:', error);
    res.status(500).json({ 
      error: 'Text generation failed',
      message: error.message 
    });
  }
});

// Text-to-Image Generation
router.post('/image', optionalAuth, async (req, res) => {
  try {
    const { error, value } = imageGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { prompt, size, style } = value;

    // Generate image using AI service
    const result = await generateImage(prompt, size, style);

    // Log activity (only if user is authenticated)
    if (req.user) {
      await logActivity(req.user.id, 'image_generation', { prompt, size, style }, { imageUrl: result });
    }

    res.json({
      success: true,
      data: {
        prompt,
        imageUrl: result,
        size,
        style
      }
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ 
      error: 'Image generation failed',
      message: error.message 
    });
  }
});

// Text-to-Voice Generation
router.post('/voice', optionalAuth, async (req, res) => {
  try {
    const { error, value } = voiceGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { text, voice, model } = value;

    // Generate voice using AI service
    const result = await generateVoice(text, voice, model);

    // Log activity (only if user is authenticated)
    if (req.user) {
      await logActivity(req.user.id, 'voice_generation', { text, voice, model }, { audioUrl: result });
    }

    res.json({
      success: true,
      data: {
        text,
        audioUrl: result,
        voice,
        model
      }
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    res.status(500).json({ 
      error: 'Voice generation failed',
      message: error.message 
    });
  }
});

// Get available models
router.get('/models', (req, res) => {
  res.json({
    textModels: [
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient text generation' },
      { id: 'gpt-4', name: 'GPT-4', description: 'Advanced text generation with better reasoning' }
    ],
    imageSizes: [
      { id: '256x256', name: 'Small (256x256)', description: 'Fast generation, smaller size' },
      { id: '512x512', name: 'Medium (512x512)', description: 'Balanced quality and speed' },
      { id: '1024x1024', name: 'Large (1024x1024)', description: 'High quality, slower generation' }
    ],
    imageStyles: [
      { id: 'realistic', name: 'Realistic', description: 'Photorealistic images' },
      { id: 'artistic', name: 'Artistic', description: 'Creative and artistic style' },
      { id: 'cartoon', name: 'Cartoon', description: 'Animated and cartoon style' }
    ],
    voiceModels: [
      { id: 'alloy', name: 'Alloy', description: 'Neutral and versatile voice' },
      { id: 'echo', name: 'Echo', description: 'Warm and friendly voice' },
      { id: 'fable', name: 'Fable', description: 'Storytelling voice' },
      { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative voice' },
      { id: 'nova', name: 'Nova', description: 'Bright and energetic voice' },
      { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle voice' }
    ]
  });
});

module.exports = router;
