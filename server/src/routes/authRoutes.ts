import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Endpoint de cadastro
router.post('/register', register);

// Endpoint de login
router.post('/login', login);

export default router;
