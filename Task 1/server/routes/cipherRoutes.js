const express = require('express');
const router = express.Router();
const { encrypt, decrypt } = require('../controllers/cipherController');

router.post('/encrypt', encrypt);
router.post('/decrypt', decrypt);

module.exports = router;
