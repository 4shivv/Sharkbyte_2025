import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

// FR-1.1: Register a new user with email and password
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const db = prisma;

    // Validation: Check for empty fields
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        error: 'Email, password, and password confirmation are required.',
      });
    }

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match.',
      });
    }

    // Validation: Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Please provide a valid email address.',
      });
    }

    // Validation: Check password strength (minimum 8 characters)
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long.',
      });
    }

    // Check if user with this email already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.',
      });
    }

    // NFR-S1: Hash the password using bcrypt with a cost factor of 10
    const passwordHash = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    // Return success response (exclude password hash)
    return res.status(201).json({
      message: 'User registered successfully.',
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Registration error:', error.message, error.stack);
    } else {
      console.error('Registration error:', error);
    }
    return res.status(500).json({
      error: 'An error occurred during registration. Please try again.',
    });
  }
};

// FR-1.2: Login user with email and password and return JWT
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const db = prisma;

    // Validation: Check for empty fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.',
      });
    }

    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
    });

    // Return 401 if user not found
    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // NFR-S1: Compare password with stored hash using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    // Return 401 if password does not match
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid email or password.',
      });
    }

    // NFR-S5 & NFR-S4: Sign JWT with userId in payload using environment variable secret
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Return 200 OK with JWT
    return res.status(200).json({
      message: 'User logged in successfully.',
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Login error:', error.message, error.stack);
    } else {
      console.error('Login error:', error);
    }
    return res.status(500).json({
      error: 'An error occurred during login. Please try again.',
    });
  }
};
