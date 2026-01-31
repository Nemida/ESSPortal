const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  chat,
  chatStream,
  analyzeGrievance,
  suggestFormFields,
  generateDashboardInsights,
} = require('../controllers/aiController');

// Chat endpoints - require authentication
router.post('/chat', authMiddleware, chat);
router.post('/chat/stream', authMiddleware, chatStream);

// Grievance analysis - admin only
router.post('/analyze-grievance', authMiddleware, adminMiddleware, analyzeGrievance);

// Form suggestions - authenticated users
router.post('/suggest-fields', authMiddleware, suggestFormFields);

// Dashboard insights - admin only
router.get('/dashboard-insights', authMiddleware, adminMiddleware, generateDashboardInsights);

module.exports = router;
