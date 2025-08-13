const express = require('express');
const router = express.Router();
const { getEvents, addEvent, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getEvents);
router.post('/', [authMiddleware, adminMiddleware], addEvent);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteEvent);

module.exports = router;