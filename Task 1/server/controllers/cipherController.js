const { caesarCipher } = require('../utils/cipher');

const processCipher = (req, res, isDecrypt) => {
  try {
    const { message, shift } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message string is required.' });
    }

    if (shift === undefined || typeof shift !== 'number' || !Number.isInteger(shift)) {
      return res.status(400).json({ error: 'Valid integer shift value is required.' });
    }

    const result = caesarCipher(message, shift, isDecrypt);
    res.json({ result });
  } catch (error) {
    console.error('Cipher processing error:', error);
    res.status(500).json({ error: 'Error processing your request.' });
  }
};

const encrypt = (req, res) => {
  processCipher(req, res, false);
};

const decrypt = (req, res) => {
  processCipher(req, res, true);
};

module.exports = {
  encrypt,
  decrypt
};
