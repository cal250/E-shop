import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import {

register,
login,
logout,
refreshToken,
changePassword,
isLoggedIn,
} from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshToken);
router.get("/verify",authenticateToken, isLoggedIn);

// Protected routes (require authentication)
router.post('/change-password', authenticateToken, changePassword);

export default router;