// routes/authRoutes.js
import { Router } from 'express';
import { register, login, logout, getCsrfToken, csrfProtection } from '../controllers/authController.js';

const router = Router();

// Expose CSRF token for clients (e.g., for use in forms)
router.get('/csrf-token', csrfProtection, getCsrfToken);

// Apply CSRF protection for POST routes.
router.post('/register', csrfProtection, register);
router.post('/login', csrfProtection, login);
router.post('/logout', csrfProtection, logout);

export default router;
