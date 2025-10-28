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
          { name: 'completeDeadline', type: 'uint64' }
        ]
      }
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
    name: 'AcceptedJob',
    inputs: [
      { name: 'jobID', type: 'bytes32', indexed: true }
    ]
  },
  {
    type: 'event',
    name: 'CompletedJob',
    inputs: [
      { name: 'jobID', type: 'bytes32', indexed: true }
    ]
  }
] as const;