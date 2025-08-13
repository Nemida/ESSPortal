const express = require('express');
const router = express.Router();
const { getAvailableForms, submitForm, getMySubmissions } = require('../controllers/formsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAvailableForms);


router.post('/submit', authMiddleware, submitForm);


router.get('/my-submissions', authMiddleware, getMySubmissions);

module.exports = router;