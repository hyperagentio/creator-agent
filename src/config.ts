import dotenv from 'dotenv';

dotenv.config();

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY!,
  privateKey: process.env.PRIVATE_KEY as `0x${string}`,
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8547',
  chainId: parseInt(process.env.CHAIN_ID || '412346'),
  jobsModuleAddress: (process.env.JOBS_MODULE_ADDRESS || '0x0000000000000000000000000000000000000555') as `0x${string}`,
  port: parseInt(process.env.PORT || '3000'),
  providers: [
    process.env.PROVIDER_1 as `0x${string}`,
    process.env.PROVIDER_2 as `0x${string}`,
    process.env.PROVIDER_3 as `0x${string}`
  ],
  stepBudget: 100000000000000000n, // 0.1 ETH
  acceptDeadlineHours: 1,
  completeDeadlineHours: 24
};

// Validate config
if (!config.openaiApiKey) throw new Error('OPENAI_API_KEY not set');
if (!config.privateKey) throw new Error('PRIVATE_KEY not set');