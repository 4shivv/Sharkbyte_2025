import Redis from 'ioredis';
import dotenv from 'dotenv';
import { processScan } from './scanProcessor';

dotenv.config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

console.log('[Worker] AgentGuard Security Scan Worker started');
console.log('[Worker] Listening for scan jobs on Redis queue...');

/**
 * Main worker loop that processes scan jobs from Redis queue
 * Uses blocking pop (BRPOP) to wait for jobs efficiently
 */
const startWorker = async (): Promise<void> => {
  while (true) {
    try {
      // BRPOP blocks until a job is available (0 = wait forever)
      // Returns [queueName, jobData] or null if timeout
      const result = await redis.brpop('scan_jobs', 0);

      if (result) {
        const [, jobDataStr] = result;
        const jobData = JSON.parse(jobDataStr);

        console.log(`[Worker] Received scan job:`, jobData);

        const { scanId, systemPrompt } = jobData;

        if (!scanId || !systemPrompt) {
          console.error('[Worker] Invalid job data: missing scanId or systemPrompt');
          continue;
        }

        // Process the scan asynchronously
        // Note: We don't await here to allow the worker to continue processing
        // other jobs while this one is being processed
        processScan(scanId, systemPrompt).catch((error) => {
          console.error(`[Worker] Unhandled error in processScan:`, error);
        });

      }
    } catch (error) {
      console.error('[Worker] Error in worker loop:', error);
      // Wait a bit before retrying to avoid rapid error loops
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[Worker] Received SIGINT, shutting down gracefully...');
  await redis.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[Worker] Received SIGTERM, shutting down gracefully...');
  await redis.quit();
  process.exit(0);
});

// Start the worker
startWorker().catch((error) => {
  console.error('[Worker] Fatal error:', error);
  process.exit(1);
});
