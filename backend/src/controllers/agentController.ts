import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

// Extend Express Request to include user from authMiddleware
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

/**
 * PROMPT CHAIN 2: Create the agent-related API routes and controller functions
 *
 * Function: getAgents
 * Handles GET /api/agents
 * Returns all agents belonging to the authenticated user
 */
export async function getAgents(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const agents = await prisma.agent.findMany({
      where: { user_id: userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({ error: 'Failed to fetch agents' });
  }
}

/**
 * Function: createAgent
 * Handles POST /api/agents
 * Creates a new agent with the provided details
 * Body: { agent_name, owner, description, system_prompt }
 */
export async function createAgent(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { agent_name, owner, description, system_prompt } = req.body;

    // Validate required fields (agent_name for FR-2.1, owner for FR-2.2)
    if (!agent_name || !owner) {
      return res.status(400).json({
        error: 'agent_name and owner are required'
      });
    }

    const agent = await prisma.agent.create({
      data: {
        agent_name,
        owner,
        description: description || null,
        system_prompt: system_prompt || null,
        user_id: userId,
      },
    });

    res.status(201).json(agent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ error: 'Failed to create agent' });
  }
}

/**
 * Function: getAgentById
 * Handles GET /api/agents/:id
 * Returns a single agent, ensuring it belongs to the authenticated user
 */
export async function getAgentById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const agent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    // Verify the agent belongs to the authenticated user (NFR-S5)
    if (agent.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this agent' });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error('Error fetching agent:', error);
    res.status(500).json({ error: 'Failed to fetch agent' });
  }
}

/**
 * Function: updateAgent
 * Handles PUT /api/agents/:id
 * Updates an agent's details (owner, description, system_prompt)
 * Body: { owner?, description?, system_prompt? }
 */
export async function updateAgent(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { agent_name, owner, description, system_prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify the agent exists and belongs to the authenticated user
    const existingAgent = await prisma.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    if (existingAgent.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this agent' });
    }

    // Update only provided fields
    const updatedAgent = await prisma.agent.update({
      where: { id },
      data: {
        ...(agent_name && { agent_name }),
        ...(owner && { owner }),
        ...(description !== undefined && { description }),
        ...(system_prompt !== undefined && { system_prompt }),
      },
    });

    res.status(200).json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: 'Failed to update agent' });
  }
}
