// Simple test client to demonstrate the creator agent
// Run with: npx tsx test-client.ts

const instruction = process.argv[2] || "create material for a SaaS business";

console.log('🎯 Sending instruction:', instruction);
console.log('');

fetch('http://localhost:3000/create-job', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ instruction })
})
  .then(async (response) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error('No response body');
    }

    console.log('📡 Connected to creator agent. Listening for updates...\n');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          
          switch (data.type) {
            case 'connected':
              console.log('✅ Connected, tracking ID:', data.trackingId);
              break;
            case 'decomposing':
              console.log('🤖 Decomposing job with OpenAI...');
              break;
            case 'progress':
              console.log('📝', data.message);
              break;
            case 'multihop_created':
              console.log('⛓️  Multihop job created!');
              console.log('   Transaction:', data.multihopId);
              break;
            case 'job_created':
              console.log(`\n📋 Step ${data.stepIndex + 1} Created:`);
              console.log('   Job ID:', data.jobId);
              console.log('   Task:', data.description.slice(0, 100) + '...');
              break;
            case 'job_accepted':
              console.log(`\n✅ Step ${data.stepIndex + 1} Accepted by ${data.executor}`);
              console.log('   Job ID:', data.jobId);
              break;
            case 'job_completed':
              console.log(`\n🎉 Step ${data.stepIndex + 1} Completed!`);
              console.log('   Job ID:', data.jobId);
              console.log('   Output:', data.outputUrl);
              break;
            case 'all_complete':
              console.log('\n╔══════════════════════════════════════════════════════╗');
              console.log('║              ALL JOBS COMPLETED! 🎊                  ║');
              console.log('╚══════════════════════════════════════════════════════╝\n');
              console.log('📦 Final outputs:');
              data.outputs.forEach((url: string, i: number) => {
                console.log(`   ${i + 1}. ${url}`);
              });
              console.log('');
              process.exit(0);
            case 'error':
              console.error('❌ Error:', data.message);
              process.exit(1);
          }
        }
      }
    }
  })
  .catch((error) => {
    console.error('❌ Request failed:', error);
    process.exit(1);
  });