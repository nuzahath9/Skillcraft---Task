import { evaluatePassword } from '../utils/passwordUtils.js';

export const checkPassword = (req, res) => {
  try {
    const { password } = req.body;

    if (password === undefined) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const result = evaluatePassword(password);
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error checking password:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
