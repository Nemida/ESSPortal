const express = require('express');
const router = express.Router();
const { getAvailableForms, submitForm, getFormById, getAllSubmissions } = require('../controllers/formsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
router.get('/', authMiddleware, getAvailableForms);
router.get('/submissions', [authMiddleware, adminMiddleware], getAllSubmissions);
router.post('/submit', authMiddleware, submitForm);
router.get('/:id', authMiddleware, getFormById);

module.exports = router;