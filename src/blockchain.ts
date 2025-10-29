import { createPublicClient, createWalletClient, http, parseEventLogs, defineChain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { config } from './config.js';
import { HyptJobsABI } from './abi/HyptJobs.js';
import { JobStepParams } from './types.js';

// Define HyperAgent chain
const hyperagent = defineChain({
  id: config.chainId,
  name: 'HyperAgent Local',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: [config.rpcUrl] }
  }
});

// Setup clients
const account = privateKeyToAccount(config.privateKey);

export const publicClient = createPublicClient({
  chain: hyperagent,
  transport: http()
});

export const walletClient = createWalletClient({
  account,
  chain: hyperagent,
  transport: http()
});

export async function createMultihopJob(steps: JobStepParams[]): Promise<{
  txHash: `0x${string}`;
  jobIds: string[];
  multihopId: string;
}> {
  console.log('Creating multihop job with steps:', steps.length);
  
  // Calculate total budget
  const totalBudget = steps.reduce((sum, step) => sum + step.budget, 0n);
  console.log('Total budget:', totalBudget.toString());

  // Send transaction
  const txHash = await walletClient.writeContract({
    address: config.jobsModuleAddress,
    abi: HyptJobsABI,
    functionName: 'createMultihopJob',
    args: [steps as readonly {
      provider: `0x${string}`;
      budget: bigint;
      description: string;
      acceptDeadline: bigint;
      completeDeadline: bigint;
    }[]],
    value: totalBudget
  });

  console.log('Transaction sent:', txHash);

  // Wait for receipt
  const receipt = await publicClient.waitForTransactionReceipt({ 
    hash: txHash,
    timeout: 60_000 
  });

  console.log('Transaction confirmed, block:', receipt.blockNumber);

  // Parse CreatedMultihopJob event from receipt  
  const createdMultihopEvents = parseEventLogs({
    abi: HyptJobsABI,
    logs: receipt.logs,
    eventName: 'CreatedMultihopJob'
  });

  if (createdMultihopEvents.length === 0) {
    throw new Error('No CreatedMultihopJob event found in receipt');
  }

  const multihopId = createdMultihopEvents[0].args.multihopID as string;
  console.log('Multihop ID:', multihopId);

  // Parse CreatedJob events from receipt
  const createdJobEvents = parseEventLogs({
    abi: HyptJobsABI,
    logs: receipt.logs,
    eventName: 'CreatedJob'
  });

  const jobIds = createdJobEvents.map(event => event.args.jobId as string);
  console.log('Created job IDs:', jobIds);

  if (jobIds.length !== steps.length) {
    throw new Error(`Expected ${steps.length} jobs, got ${jobIds.length}`);
  }

  return { txHash, jobIds, multihopId };
}

export async function getJobOutput(jobId: string): Promise<string> {
  console.log('Fetching job output for:', jobId);
  
  const job = await publicClient.readContract({
    address: config.jobsModuleAddress,
    abi: HyptJobsABI,
    functionName: 'getJob',
    args: [jobId as `0x${string}`]
  });

  console.log('Job state:', job);
  
  // Note: The actual output URL is stored elsewhere in your system
  // For now, we'll need to get it from the CompleteJob event
  return 'Output stored in event logs';
}

export function prepareJobSteps(descriptions: string[]): JobStepParams[] {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const acceptDeadline = now + BigInt(config.acceptDeadlineHours * 3600);
  const completeDeadline = now + BigInt(config.completeDeadlineHours * 3600);

  return descriptions.map((description, index) => ({
    provider: config.providers[index],
    budget: config.stepBudget,
    description,
    acceptDeadline,
    completeDeadline
  }));
}