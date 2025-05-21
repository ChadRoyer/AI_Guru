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

  const systemPrompt = 'Workflow Discovery PLACEHOLDER';

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    })
  });

  if (!openaiRes.ok) {
    throw new Error(`OpenAI request failed: ${openaiRes.status} ${openaiRes.statusText}`);
  }

  const data = await openaiRes.json();
  const text = data.choices?.[0]?.message?.content;

  if (typeof text !== 'string') {
    throw new Error('Invalid OpenAI response');
  }

  return new Response(text);
}

