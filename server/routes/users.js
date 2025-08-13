const express = require('express');
const router = express.Router();
const { getAllUsers, addUser, deleteUser, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get('/', [authMiddleware, adminMiddleware], getAllUsers);
router.post('/', [authMiddleware, adminMiddleware], addUser);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteUser);


router.put('/:userIdToUpdate', authMiddleware, updateUser);

module.exports = router;