const express = require('express');
const router = express.Router();
const { getPublications, addPublication, deletePublication } = require('../controllers/publicationController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get('/', getPublications);


router.post('/', [authMiddleware, adminMiddleware], addPublication);


router.delete('/:id', [authMiddleware, adminMiddleware], deletePublication);

module.exports = router;