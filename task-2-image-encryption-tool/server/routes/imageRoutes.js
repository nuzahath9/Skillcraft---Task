const express = require('express');
const multer = require('multer');
const { processImage } = require('../controllers/imageController');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB max file size
    }
});

router.post('/process-image', upload.single('image'), processImage);

module.exports = router;
