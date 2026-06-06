import express from 'express';
import { checkPassword } from '../controllers/passwordController.js';

const router = express.Router();

router.post('/check-password', checkPassword);

export default router;
