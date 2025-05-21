export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletion {
  text: string;
}

export async function sendChat(messages: ChatMessage[]): Promise<ChatCompletion> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not defined');
  }
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages
    })
  });
  if (!res.ok) {
    throw new Error(`OpenAI request failed: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  return { text };
}

import { PROMPT as WORKFLOW_DISCOVERY_SYSTEM } from './prompts/workflowDiscovery';
import { PROMPT as AI_OPPORTUNITIES_SYSTEM } from './prompts/aiOpportunities';

export async function sendWorkflowDiscovery(userMessages: ChatMessage[]) {
  const messages = [
    { role: 'system', content: WORKFLOW_DISCOVERY_SYSTEM },
    ...userMessages
  ];
  return sendChat(messages);
}

export async function sendAiOpportunities(userMessages: ChatMessage[]) {
  const messages = [
    { role: 'system', content: AI_OPPORTUNITIES_SYSTEM },
    ...userMessages
  ];
  return sendChat(messages);
}

export async function sendCreatePrompt(userMessages: ChatMessage[]) {
  const { PROMPT as CREATE_PROMPT_SYSTEM } = await import('./prompts/createPrompt');
  const messages = [
    { role: 'system', content: CREATE_PROMPT_SYSTEM },
    ...userMessages
  ];
  return sendChat(messages);
}
