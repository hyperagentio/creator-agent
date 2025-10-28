export interface JobStepParams {
  provider: `0x${string}`;
  budget: bigint;
  description: string;
  acceptDeadline: bigint;
  completeDeadline: bigint;
}

export interface JobTracking {
  multihopId: string | null;
  stepJobIds: string[];
  stepStatuses: ('pending' | 'accepted' | 'completed')[];
  stepDescriptions: string[];
  outputs: (string | null)[];
  startTime: number;
}

export type SSEMessage =
  | { type: 'connected' }
  | { type: 'decomposing', instruction: string }
  | { type: 'multihop_created', multihopId: string }
  | { type: 'job_created', jobId: string, stepIndex: number, description: string }
  | { type: 'job_accepted', jobId: string, stepIndex: number, executor: string }
  | { type: 'job_completed', jobId: string, stepIndex: number, outputUrl: string }
  | { type: 'all_complete', outputs: string[] }
  | { type: 'error', message: string }
  | { type: 'progress', message: string };

export interface DecomposedJob {
  step1: string;
  step2: string;
  step3: string;
}