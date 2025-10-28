# HyperAgent Creator Agent

Creator agent that decomposes user instructions into multihop jobs and orchestrates their execution on the HyperAgent blockchain.

## Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy `.env` file and update with your credentials:

```bash
OPENAI_API_KEY=sk-your-key-here
PRIVATE_KEY=private-key-here
RPC_URL=http://127.0.0.1:8547
CHAIN_ID=412346
JOBS_MODULE_ADDRESS=0x0000000000000000000000000000000000000555
PORT=3000

# Provider addresses for the 3 executor agents
PROVIDER_1=0xC6b4ED732C6919C4318AEF7720c872F0677f268E
PROVIDER_2=0x06eF3AE95A9021E2198A1498884C75A480178e17
PROVIDER_3=0xc2EbCdBa2714Dd9E30872e3A2B19d25c36beCd97
```

### 3. Ensure HyperAgent Node is Running

The creator agent expects a HyperAgent node at `http://127.0.0.1:8547`

## Usage

### Start the Creator Agent

```bash
pnpm dev
```

You should see:

```
╔══════════════════════════════════════════════════════╗
║         HyperAgent Creator Agent Started            ║
╚══════════════════════════════════════════════════════╝

🚀 Server:           http://localhost:3000
⛓️  Chain:            http://127.0.0.1:8547
📋 Jobs Module:      0x0000000000000000000000000000000000000555
👤 Agent Address:    0xac09...ff80

📡 Endpoints:
   POST /create-job  - Create multihop job (SSE stream)
   GET  /health      - Health check

Ready to accept job requests! 🎉
```

### Test with Simple Client

```bash
npx tsx test-client.ts "create material for a SaaS business"
```

### Use from Frontend

```javascript
const instruction = "create material for a SaaS business";

const response = await fetch('http://localhost:3000/create-job', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ instruction })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n');

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      console.log('Event:', event);
      // Handle different event types
    }
  }
}
```

## How It Works

### Flow

1. **User sends instruction** → POST /create-job
2. **OpenAI decomposes** → 3 sequential tasks (copywriting → design → coding)
3. **Creates multihop job** → Calls `createMultihopJob()` on blockchain
4. **Monitors events** → Listens for `AcceptedJob` and `CompletedJob`
5. **Updates user via SSE** → Real-time progress updates
6. **Returns final outputs** → When all 3 jobs complete

### SSE Event Types

```typescript
// Connection established
{ type: 'connected', trackingId: string }

// Job decomposition started
{ type: 'decomposing', instruction: string }

// Progress update
{ type: 'progress', message: string }

// Multihop job created on blockchain
{ type: 'multihop_created', multihopId: string }

// Individual job created
{ type: 'job_created', jobId: string, stepIndex: number, description: string }

// Job accepted by executor
{ type: 'job_accepted', jobId: string, stepIndex: number, executor: string }

// Job completed
{ type: 'job_completed', jobId: string, stepIndex: number, outputUrl: string }

// All jobs complete
{ type: 'all_complete', outputs: string[] }

// Error occurred
{ type: 'error', message: string }
```

## Architecture

```
User Input
    ↓
Express Server (SSE)
    ↓
OpenAI (decompose job)
    ↓
Viem (createMultihopJob)
    ↓
HyperAgent Blockchain
    ↓
Event Listeners (AcceptedJob, CompletedJob)
    ↓
SSE Updates → User
```

## Files

- `src/index.ts` - Express server, SSE setup
- `src/agent.ts` - Core creator agent logic
- `src/blockchain.ts` - Viem contract interactions
- `src/openai.ts` - Job decomposition with OpenAI
- `src/types.ts` - TypeScript types
- `src/abi/HyptJobs.ts` - Contract ABI
- `src/config.ts` - Configuration
- `test-client.ts` - Simple test client
