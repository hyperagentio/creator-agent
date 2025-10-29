export const HyptJobsABI = [
  {
    type: 'function',
    name: 'createMultihopJob',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'steps',
        type: 'tuple[]',
        components: [
          { name: 'provider', type: 'address' },
          { name: 'budget', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'acceptDeadline', type: 'uint64' },
          { name: 'completeDeadline', type: 'uint64' }
        ]
      }
    ],
    outputs: []
  },
{
    type: 'function',
    name: 'getJob',
    stateMutability: 'view',
    inputs: [{ name: 'jobId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'creator', type: 'address' },
          { name: 'provider', type: 'address' },
          { name: 'budget', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'state', type: 'uint8' },
          { name: 'createdAt', type: 'uint64' },
          { name: 'acceptDeadline', type: 'uint64' },
          { name: 'completeDeadline', type: 'uint64' },
          { name: 'multihopId', type: 'bytes32' },
          { name: 'step', type: 'uint64' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'acceptMultihopJobStep',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'multihopId', type: 'bytes32' },
      { name: 'stepIndex', type: 'uint64' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'completeMultihopJobStep',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'multihopId', type: 'bytes32' },
      { name: 'stepIndex', type: 'uint64' },
      { name: 'outputUrl', type: 'string' },
      { name: 'multihopOutputUrl', type: 'string' }
    ],
    outputs: []
  },
  {
    type: 'function',
    name: 'getMultihopJobStep',
    stateMutability: 'view',
    inputs: [
      { name: 'multihopId', type: 'bytes32' },
      { name: 'stepIndex', type: 'uint64' }
    ],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'creator', type: 'address' },
          { name: 'provider', type: 'address' },
          { name: 'budget', type: 'uint256' },
          { name: 'description', type: 'string' },
          { name: 'state', type: 'uint8' },
          { name: 'createdAt', type: 'uint64' },
          { name: 'acceptDeadline', type: 'uint64' },
          { name: 'completeDeadline', type: 'uint64' },
          { name: 'multihopId', type: 'bytes32' },
          { name: 'step', type: 'uint64' }
        ]
      }
    ]
  },
  {
    type: 'function',
    name: 'getMultihopOutputUrl',
    stateMutability: 'view',
    inputs: [
      { name: 'jobID', type: 'bytes32' }
    ],
    outputs: [
      { name: '', type: 'string' }
    ]
  },
  {
    type: 'function',
    name: 'getMultihopStepJobId',
    stateMutability: 'view',
    inputs: [
      { name: 'multihopId', type: 'bytes32' },
      { name: 'stepIndex', type: 'uint64' }
    ],
    outputs: [
      { name: '', type: 'bytes32' }
    ]
  },
  {
    type: 'event',
    name: 'CreatedJob',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'jobId', type: 'bytes32', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'AcceptedMultihopJobStep',
    inputs: [
      { name: 'multihopID', type: 'bytes32', indexed: true },
      { name: 'stepIndex', type: 'uint64', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'CompletedMultihopJobStep',
    inputs: [
      { name: 'multihopID', type: 'bytes32', indexed: true },
      { name: 'stepIndex', type: 'uint64', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'CreatedMultihopJob',
    inputs: [
      { name: 'multihopID', type: 'bytes32', indexed: true }
    ]
  }
] as const;