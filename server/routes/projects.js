const express = require('express');
const router = express.Router();
const { getProjects, addProject, deleteProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get('/', authMiddleware, getProjects);


router.post('/', [authMiddleware, adminMiddleware], addProject);


router.delete('/:id', [authMiddleware, adminMiddleware], deleteProject);

module.exports = router;