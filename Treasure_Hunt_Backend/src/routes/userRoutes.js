import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import { authenticateToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', authenticateToken, isAdmin, registerUser);
router.post('/login', loginUser);

export default router;