const express = require('express');
const router = express.Router();
const { submitGrievance, getAllGrievances } = require('../controllers/grievanceController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/submit', authMiddleware, submitGrievance);

router.get('/', [authMiddleware, adminMiddleware], getAllGrievances);

module.exports = router;