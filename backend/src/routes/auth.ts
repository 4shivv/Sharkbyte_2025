import express, { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';

const router = Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerUser);

// POST /api/auth/login - Login user and return JWT
router.post('/login', loginUser);

export default router;
