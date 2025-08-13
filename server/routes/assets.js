const express = require('express');
const router = express.Router();
const { getMyAssets, getAllAssets, addAsset, deleteAsset, assignAsset, unassignAsset, getAssetHistory } = require('../controllers/assetController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


router.get('/my', authMiddleware, getMyAssets);


router.get('/', [authMiddleware, adminMiddleware], getAllAssets);
router.post('/', [authMiddleware, adminMiddleware], addAsset);
router.delete('/:id', [authMiddleware, adminMiddleware], deleteAsset);
router.post('/assign', [authMiddleware, adminMiddleware], assignAsset);
router.put('/unassign', [authMiddleware, adminMiddleware], unassignAsset);
router.get('/history', [authMiddleware, adminMiddleware], getAssetHistory);

module.exports = router;