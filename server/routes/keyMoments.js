const express = require('express');
const router = express.Router();
const { getImages, addImage, deleteImage } = require('../controllers/keyMomentsController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', getImages);
router.post('/', [authMiddleware, adminMiddleware], addImage);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteImage);

module.exports = router;