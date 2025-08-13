const express = require('express');
const router = express.Router();
const { getAnnouncements, addAnnouncement, deleteAnnouncement } = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getAnnouncements); 
router.post('/', [authMiddleware, adminMiddleware], addAnnouncement);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteAnnouncement);

module.exports = router;