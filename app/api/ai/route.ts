import { OpenAIStream, StreamingTextResponse } from 'ai';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RequestBody {
  messages: Message[];
  phase: 'parse' | 'suggest';
}

export async function POST(req: Request) {
  const { messages, phase } = (await req.json()) as RequestBody;

  if (phase !== 'parse') {
    throw new Error(`Unsupported phase: ${phase}`);
  }

  const systemPrompt = `You are Workflow Discovery, an assistant that turns a conversation into a workflow diagram. After analyzing the chat, respond with a single \`\`\`json code block containing an object with \"nodes\" and \"edges\" arrays. Each node should have an \"id\", \"data.label\" and a \"position\" with numeric \"x\" and \"y\" coordinates. Each edge should include an \"id\", \"source\" and \"target\". Provide no other text outside of the JSON code block.`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined');
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
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

