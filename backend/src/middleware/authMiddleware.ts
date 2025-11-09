import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

// Authentication middleware to protect routes
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization;

    // Return 401 if no token is provided
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authorization token is required.',
      });
    }

    // Extract the token from "Bearer <token>"
    const token = authHeader.substring(7);

    // NFR-S4: Verify token using JWT secret from environment variable
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

    let decoded: any;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (jwtError) {
      // Return 401 if token is invalid or expired
      return res.status(401).json({
        error: 'Invalid or expired token.',
      });
    }

    // Attach user ID to request object for use in route handlers
    req.user = { id: decoded.userId };

    // Call next middleware/route handler
    next();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Auth middleware error:', error.message);
    } else {
      console.error('Auth middleware error:', error);
    }
    return res.status(401).json({
      error: 'Authentication failed.',
    });
  }
};
