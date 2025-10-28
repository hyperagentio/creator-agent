import { Response } from 'express';
import { publicClient } from './blockchain.js';
import { config } from './config.js';
import { HyptJobsABI } from './abi/HyptJobs.js';
import { JobTracking, SSEMessage } from './types.js';
import { decomposeJob } from './openai.js';
import { createMultihopJob, prepareJobSteps, getJobOutput } from './blockchain.js';

export class CreatorAgent {
  private tracking: Map<string, JobTracking> = new Map();
  private sseClients: Map<string, Response> = new Map();

  async handleJobRequest(instruction: string, trackingId: string, res: Response): Promise<void> {
    // Store SSE client
    this.sseClients.set(trackingId, res);

    // Initialize tracking
    const tracking: JobTracking = {
      multihopId: null,
      stepJobIds: [],
      stepStatuses: ['pending', 'pending', 'pending'],
      stepDescriptions: [],
      outputs: [null, null, null],
      startTime: Date.now()
    };
    this.tracking.set(trackingId, tracking);

    try {
      // Step 1: Decompose job using OpenAI
      this.sendSSE(trackingId, { type: 'decomposing', instruction });
      console.log(`[${trackingId}] Decomposing instruction:`, instruction);

      const decomposed = await decomposeJob(instruction);
      const descriptions = [decomposed.step1, decomposed.step2, decomposed.step3];
      tracking.stepDescriptions = descriptions;

      console.log(`[${trackingId}] Decomposed into 3 steps`);
      this.sendSSE(trackingId, { 
        type: 'progress', 
        message: 'Job decomposed into 3 steps: copywriting → design → coding' 
      });

      // Step 2: Prepare job parameters
      const steps = prepareJobSteps(descriptions);

      // Step 3: Create multihop job on blockchain
      this.sendSSE(trackingId, { 
        type: 'progress', 
        message: 'Creating multihop job on blockchain...' 
      });

      const { txHash, jobIds } = await createMultihopJob(steps);
      tracking.stepJobIds = jobIds;

      console.log(`[${trackingId}] Multihop created, tx:`, txHash);
      this.sendSSE(trackingId, { type: 'multihop_created', multihopId: txHash });

      // Send individual job created events
      jobIds.forEach((jobId, index) => {
        this.sendSSE(trackingId, {
          type: 'job_created',
          jobId,
          stepIndex: index,
          description: descriptions[index]
        });
      });

      // Step 4: Start listening for events
      this.startEventListening(trackingId);

    } catch (error) {
      console.error(`[${trackingId}] Error:`, error);
      this.sendSSE(trackingId, {
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      this.cleanup(trackingId);
    }
  }

  private startEventListening(trackingId: string): void {
    const tracking = this.tracking.get(trackingId);
    if (!tracking) return;

    console.log(`[${trackingId}] Starting event listeners for jobs:`, tracking.stepJobIds);

    // Listen for AcceptedJob events
    const unwatch1 = publicClient.watchContractEvent({
      address: config.jobsModuleAddress,
      abi: HyptJobsABI,
      eventName: 'AcceptedJob',
      onLogs: (logs) => {
        for (const log of logs) {
          const jobId = log.args.jobID as string;
          const stepIndex = tracking.stepJobIds.indexOf(jobId);
          
          if (stepIndex !== -1) {
            console.log(`[${trackingId}] Job ${stepIndex} accepted:`, jobId);
            tracking.stepStatuses[stepIndex] = 'accepted';
            this.sendSSE(trackingId, {
              type: 'job_accepted',
              jobId,
              stepIndex,
              executor: 'Agent ' + (stepIndex + 1)
            });
          }
        }
      }
    });

    // Listen for CompletedJob events
    const unwatch2 = publicClient.watchContractEvent({
      address: config.jobsModuleAddress,
      abi: HyptJobsABI,
      eventName: 'CompletedJob',
      onLogs: async (logs) => {
        for (const log of logs) {
          const jobId = log.args.jobID as string;
          const stepIndex = tracking.stepJobIds.indexOf(jobId);
          
          if (stepIndex !== -1) {
            console.log(`[${trackingId}] Job ${stepIndex} completed:`, jobId);
            tracking.stepStatuses[stepIndex] = 'completed';

            // For demo, we'll use placeholder output URLs
            // In production, this would come from the event or contract storage
            const outputUrl = `https://drive.google.com/file/step${stepIndex + 1}`;
            tracking.outputs[stepIndex] = outputUrl;

            this.sendSSE(trackingId, {
              type: 'job_completed',
              jobId,
              stepIndex,
              outputUrl
            });

            // Check if all jobs are complete
            if (tracking.stepStatuses.every(s => s === 'completed')) {
              console.log(`[${trackingId}] All jobs completed!`);
              
              const allOutputs = tracking.outputs.filter((o): o is string => o !== null);
              this.sendSSE(trackingId, {
                type: 'all_complete',
                outputs: allOutputs
              });

              // Cleanup
              unwatch1();
              unwatch2();
              setTimeout(() => this.cleanup(trackingId), 5000);
            }
          }
        }
      }
    });
  }

  private sendSSE(trackingId: string, message: SSEMessage): void {
    const client = this.sseClients.get(trackingId);
    if (client) {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    }
  }

  private cleanup(trackingId: string): void {
    const client = this.sseClients.get(trackingId);
    if (client) {
      client.end();
    }
    this.sseClients.delete(trackingId);
    this.tracking.delete(trackingId);
    console.log(`[${trackingId}] Cleaned up`);
  }
}