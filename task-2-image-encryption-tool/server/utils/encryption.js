/**
 * Applies a mathematical transformation to pixel RGB values.
 * R = (R + key) % 256
 * G = (G + key) % 256
 * B = (B + key) % 256
 */
exports.applyMathTransform = (image, key, isDecrypt) => {
    const k = Math.abs(key) % 256;
    
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
        for (let i = 0; i < 3; i++) { // R, G, B (skip Alpha at i=3)
            let val = this.bitmap.data[idx + i];
            if (isDecrypt) {
                val = (val - k + 256) % 256;
            } else {
                val = (val + k) % 256;
            }
            this.bitmap.data[idx + i] = val;
        }
    });
};

/**
 * Swaps pixels based on a pattern (Row Reversal seeded by key).
 * We reverse the rows where (y + key) % 2 === 0.
 * This is a perfectly symmetric operation (running it twice restores the image).
 */
exports.applyPixelSwap = (image, key) => {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    const data = image.bitmap.data;
    const k = Math.abs(key);
    
    for (let y = 0; y < height; y++) {
        // Deterministic condition based on row index and key
        if ((y + k) % 2 === 0) {
            // Reverse the row
            for (let x = 0; x < Math.floor(width / 2); x++) {
                const oppX = width - 1 - x;
                const idx1 = (width * y + x) << 2; // Multiply by 4 (RGBA)
                const idx2 = (width * y + oppX) << 2;
                
                // Swap RGBA bytes
                for (let i = 0; i < 4; i++) {
                    const temp = data[idx1 + i];
                    data[idx1 + i] = data[idx2 + i];
                    data[idx2 + i] = temp;
                }
            }
        }
    }
};
