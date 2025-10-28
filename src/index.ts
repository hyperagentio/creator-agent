import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { config } from './config.js';
import { CreatorAgent } from './agent.js';

const app = express();
const agent = new CreatorAgent();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Create job endpoint
app.post('/create-job', (req, res) => {
  const { instruction } = req.body;

  if (!instruction || typeof instruction !== 'string') {
    return res.status(400).json({ error: 'instruction is required and must be a string' });
  }

  const trackingId = randomUUID();
  
  // Setup SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', trackingId })}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    console.log(`Client disconnected: ${trackingId}`);
  });

  // Start job processing
  agent.handleJobRequest(instruction, trackingId, res).catch(error => {
    console.error('Agent error:', error);
    res.write(`data: ${JSON.stringify({ 
      type: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    })}\n\n`);
    res.end();
  });
});

// Start server
app.listen(config.port, () => {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║         HyperAgent Creator Agent Started            ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server:           http://localhost:${config.port}`);
  console.log(`⛓️  Chain:            ${config.rpcUrl}`);
  console.log(`📋 Jobs Module:      ${config.jobsModuleAddress}`);
  console.log(`👤 Agent Address:    ${config.privateKey.slice(0, 6)}...${config.privateKey.slice(-4)}`);
  console.log('');
  console.log('📡 Endpoints:');
  console.log(`   POST /create-job  - Create multihop job (SSE stream)`);
  console.log(`   GET  /health      - Health check`);
  console.log('');
  console.log('Ready to accept job requests! 🎉');
  console.log('');
});