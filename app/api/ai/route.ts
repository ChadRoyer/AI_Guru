import { OpenAIStream, StreamingTextResponse } from 'ai';
import { PROMPT as WORKFLOW_DISCOVERY_SYSTEM } from '../../../src/prompts/workflowDiscovery';
import { PROMPT as AI_OPPORTUNITIES_SYSTEM } from '../../../src/prompts/aiOpportunities';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RequestBody {
  messages?: Message[];
  diagram?: any;
  phase: 'parse' | 'suggest';
}

export async function POST(req: Request) {
  const { messages = [], diagram, phase } = (await req.json()) as RequestBody;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  if (phase === 'suggest') {
    const prompt = AI_OPPORTUNITIES_SYSTEM;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          { role: 'system', content: prompt },
          { role: 'user', content: JSON.stringify(diagram ?? {}) }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`OpenAI request failed: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '';
    return new Response(text);
  }

  if (phase !== 'parse') {
    throw new Error(`Unsupported phase: ${phase}`);
  }

  const systemPrompt = WORKFLOW_DISCOVERY_SYSTEM;

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  });

  if (!openaiRes.ok) {
    throw new Error(
      `OpenAI request failed: ${openaiRes.status} ${openaiRes.statusText}`
    );
  }

  const stream = OpenAIStream(openaiRes, {
    experimental_streamMode: 'text'
  });

  return new StreamingTextResponse(stream);
}

