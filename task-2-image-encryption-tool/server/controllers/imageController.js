const Jimp = require('jimp');
const { applyMathTransform, applyPixelSwap } = require('../utils/encryption');

exports.processImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const { method, action, key } = req.body;
        
        // Parse key to an integer (if string, hash it simply, else parseInt)
        let numericKey = parseInt(key, 10);
        if (isNaN(numericKey)) {
            // Simple string to number hash
            numericKey = 0;
            for (let i = 0; i < String(key).length; i++) {
                numericKey += String(key).charCodeAt(i);
            }
        }

        // Read image from memory buffer
        const image = await Jimp.read(req.file.buffer);

        // Apply selected method
        const isDecrypt = action === 'decrypt';
        
        if (method === 'math') {
            applyMathTransform(image, numericKey, isDecrypt);
        } else if (method === 'swap') {
            applyPixelSwap(image, numericKey); // Swap is symmetric, so no need for isDecrypt check
        } else {
            return res.status(400).json({ error: 'Invalid encryption method selected.' });
        }

        // Convert processed image back to buffer
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        
        // Send as base64 so frontend can easily display/download it
        const base64Data = buffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Data}`;

        res.json({ 
            success: true, 
            resultImage: dataUrl 
        });

    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ error: 'Failed to process image. Make sure it is a valid image file.' });
    }
};
