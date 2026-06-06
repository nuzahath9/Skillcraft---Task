/**
 * Applies a Caesar cipher shift to the given text.
 * @param {string} text - The input text.
 * @param {number} shift - The shift value.
 * @param {boolean} decrypt - Whether to decrypt (inverts the shift).
 * @returns {string} The shifted text.
 */
function caesarCipher(text, shift, decrypt = false) {
  if (typeof text !== 'string') return '';
  if (typeof shift !== 'number') return text;

  // Normalize shift to be within 0-25
  let normalizedShift = shift % 26;
  if (decrypt) {
    normalizedShift = (26 - normalizedShift) % 26;
  }
  if (normalizedShift < 0) {
    normalizedShift += 26;
  }

  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = text.charCodeAt(i);

    // Uppercase letters
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
    }
    // Lowercase letters
    else if (code >= 97 && code <= 122) {
      result += String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97);
    }
    // Non-alphabet characters
    else {
      result += char;
    }
  }

  return result;
}

module.exports = {
  caesarCipher
};
