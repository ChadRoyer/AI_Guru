import React, { useState, useRef, KeyboardEvent } from 'react';
import { useDiagram } from './DiagramContext';

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

const initialMessages: Message[] = [
  { id: '1', role: 'user', content: 'Hello!' },
  { id: '2', role: 'assistant', content: 'Hi there! How can I help you?' }
];

export default function ChatPanel() {
  const { diagramUpdated } = useDiagram();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: ''
    };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const res = await fetch('/api/ai?phase=parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, phase: 'parse' })
      });

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let done = false;
      let acc = '';
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value);
          acc += chunk;
          const content = acc;
          setMessages(prev =>
            prev.map(m =>
              m.id === assistantMessage.id ? { ...m, content } : m
            )
          );
          setTimeout(scrollToBottom, 0);
        }
      }

      const match = acc.match(/```json\s*([\s\S]*?)```/);
      if (match) {
        try {
          const json = JSON.parse(match[1]);
          diagramUpdated(json);
        } catch (err) {
          console.error('Failed to parse JSON', err);
        }
      }
    } catch (err) {
      console.error('Request failed', err);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ margin: '0.25rem 0' }}>
            <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <div>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <textarea
        style={{ resize: 'none' }}
        rows={3}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
      />
    </div>
  );
}
