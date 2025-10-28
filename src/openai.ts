import OpenAI from 'openai';
import { config } from './config.js';
import { DecomposedJob } from './types.js';

//const baseUrl = "https://api.deepseek.com"
const openai = new OpenAI({ apiKey: config.openaiApiKey });

const SYSTEM_PROMPT = `You are a job decomposition specialist for an AI agent marketplace. Your task is to break down user requests into exactly 3 sequential jobs that will be executed by specialized agents:

1. COPYWRITING AGENT - Creates written content (copy, text, documentation)
2. DESIGN AGENT - Creates visual designs (mockups, UI/UX, graphics)
3. CODING AGENT - Implements code (websites, apps, scripts)

Guidelines:
- Each job description should be clear, specific, and actionable
- Jobs should build on each other sequentially
- Be concise but include all necessary context
- Format: Return a JSON object with step1, step2, step3 fields

Example for "create material for a SaaS business":
{
  "step1": "Write compelling copy for a SaaS landing page targeting small business owners. Include: hero headline, value proposition, 3 key features with descriptions, social proof section, and clear CTA. Tone: professional yet approachable. Length: ~500 words total.",
  "step2": "Design a modern, professional landing page layout based on the provided copy. Create a high-fidelity mockup showing: hero section, features grid, testimonials, and CTA. Style: clean, contemporary SaaS aesthetic with blue/white color scheme. Deliverable: Figma file or high-res images.",
  "step3": "Implement the landing page design as a fully functional website. Use modern web technologies (HTML, CSS, JavaScript or React). Make it responsive, fast-loading, and include smooth scroll animations. Host the final page and provide the live URL."
}`;

export async function decomposeJob(instruction: string): Promise<DecomposedJob> {
  return {
    step1: "Write engaging and persuasive copy for a SaaS landing page aimed at startups looking to improve productivity. Include: a captivating headline, clear value proposition, description of 3 main features with benefits, customer testimonials, and a strong call-to-action. Tone should be informative and encouraging. Total length: approximately 600 words.",
    step2: "Design a sleek, professional landing page layout using the provided copy. Develop a high-fidelity mockup featuring sections for the headline, feature highlights, testimonials, and CTA. Incorporate a modern SaaS design aesthetic with a minimalist style and a color palette of green and white. Deliver the design as a Figma file or high-resolution images.",
    step3: "Code the landing page design into a fully functional website. Utilize HTML, CSS, and JavaScript to ensure it's responsive and optimized for all devices. Implement smooth scrolling and interactive elements as needed. Deploy the website to a hosting platform and provide the live URL.",
  };

/*   try {
    const response = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: instruction }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const decomposed = JSON.parse(content) as DecomposedJob;
    
    // Validate structure
    if (!decomposed.step1 || !decomposed.step2 || !decomposed.step3) {
      throw new Error('Invalid decomposition structure');
    }

    return decomposed;
  } catch (error) {
    console.error('OpenAI decomposition error:', error);
    throw new Error(`Failed to decompose job: ${error instanceof Error ? error.message : 'unknown error'}`);
  } */
}

/* 

([
{
"provider":"0xC6b4ED732C6919C4318AEF7720c872F0677f268E",
"budget":"100000000000000000",
"description":"Write engaging and persuasive copy for a SaaS landing page aimed at startups looking to improve productivity. Include: a captivating headline, clear value proposition, description of 3 main features with benefits, customer testimonials, and a strong call-to-action. Tone should be informative and encouraging. Total length: approximately 600 words.",
"acceptDeadline":"1761656121",
"completeDeadline":"1761738921"
},

{
"provider":"0x06eF3AE95A9021E2198A1498884C75A480178e17",
"budget":"100000000000000000",
"description":"Design a sleek, professional landing page layout using the provided copy. Develop a high-fidelity mockup featuring sections for the headline, feature highlights, testimonials, and CTA. Incorporate a modern SaaS design aesthetic with a minimalist style and a color palette of green and white. Deliver the design as a Figma file or high-resolution images.",
"acceptDeadline":"1761656121",
"completeDeadline":"1761738921"
},

{
"provider":"0xc2EbCdBa2714Dd9E30872e3A2B19d25c36beCd97",
"budget":"100000000000000000",
"description":"Code the landing page design into a fully functional website. Utilize HTML, CSS, and JavaScript to ensure it's responsive and optimized for all devices. Implement smooth scrolling and interactive elements as needed. Deploy the website to a hosting platform and provide the live URL.",
"acceptDeadline":"1761656121",
"completeDeadline":"1761738921"
}
])


*/