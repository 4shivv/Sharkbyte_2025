import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// FR-3.1: Initiate security scan for an agent
export const initiateScan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agentId } = req.params;
    const userId = (req as any).user.id;

    // Verify agent exists and belongs to user
    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        user_id: userId,
      },
    });

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    if (!agent.system_prompt) {
      res.status(400).json({ error: 'Agent has no system prompt to scan' });
      return;
    }

    // Create scan record with pending status (FR-3.8)
    const scan = await prisma.scan.create({
      data: {
        agent_id: agentId,
        status: 'pending',
      },
    });

    // Push job to Redis queue for worker to process
    await redis.lpush('scan_jobs', JSON.stringify({
      scanId: scan.id,
      agentId: agent.id,
      systemPrompt: agent.system_prompt,
    }));

    // Return 202 Accepted with scanId for polling
    res.status(202).json({
      scanId: scan.id,
      status: 'pending',
      message: 'Scan initiated successfully',
    });
  } catch (error) {
    console.error('Error initiating scan:', error);
    res.status(500).json({ error: 'Failed to initiate scan' });
  }
};

// FR-3.8: Retrieve scan results
export const getScanResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scanId } = req.params;
    const userId = (req as any).user.id;

    // Fetch scan and verify ownership through agent relationship
    const scan = await prisma.scan.findFirst({
      where: {
        id: scanId,
        agent: {
          user_id: userId,
        },
      },
      include: {
        agent: {
          select: {
            agent_name: true,
            system_prompt: true,
          },
        },
      },
    });

    if (!scan) {
      res.status(404).json({ error: 'Scan not found' });
      return;
    }

    res.json({
      id: scan.id,
      status: scan.status,
      security_score: scan.security_score,
      vulnerabilities: scan.vulnerabilities,
      attack_simulations: scan.attack_simulations,
      remediation_steps: scan.remediation_steps,
      error_message: scan.error_message,
      agent_name: scan.agent.agent_name,
      createdAt: scan.createdAt,
      updatedAt: scan.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching scan result:', error);
    res.status(500).json({ error: 'Failed to fetch scan result' });
  }
};

// Get all scans for an agent
export const getAgentScans = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agentId } = req.params;
    const userId = (req as any).user.id;

    // Verify agent belongs to user
    const agent = await prisma.agent.findFirst({
      where: {
        id: agentId,
        user_id: userId,
      },
    });

    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const scans = await prisma.scan.findMany({
      where: {
        agent_id: agentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        status: true,
        security_score: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(scans);
  } catch (error) {
    console.error('Error fetching agent scans:', error);
    res.status(500).json({ error: 'Failed to fetch scans' });
  }
};
