import express, { Router } from 'express';
import { createAgent, getAgents, getAgentById, updateAgent } from '../controllers/agentController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// All agent routes are protected by authMiddleware
router.use(authMiddleware);

// GET /api/agents - List all agents for the authenticated user
router.get('/', getAgents);

// POST /api/agents - Create a new agent
router.post('/', createAgent);

// GET /api/agents/:id - Get a single agent by ID
router.get('/:id', getAgentById);

// PUT /api/agents/:id - Update an agent by ID
router.put('/:id', updateAgent);

export default router;
