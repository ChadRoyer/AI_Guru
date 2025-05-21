import React, { useState, useRef, KeyboardEvent, useEffect } from 'react'
import { useDiagram } from './DiagramContext'
import { getSupabaseClient } from '../lib/supabaseClient'
import TypingIndicator from './TypingIndicator'
import Toast from './Toast'

export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
}

export interface ChatPanelProps {
  workflowId: string | null
  onWorkflowCreated: (id: string) => void
}

export default function ChatPanel({ workflowId, onWorkflowCreated }: ChatPanelProps) {
  const { diagramUpdated } = useDiagram()
  const supabase = getSupabaseClient()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!workflowId) {
      setMessages([])
      return
    }
    ;(async () => {
      const { data: msgs } = await supabase
        .from('messages')
        .select('id, role, content')
        .eq('workflow_id', workflowId)
        .order('created_at')
      setMessages(msgs ?? [])
      const { data: wf } = await supabase
        .from('workflows')
        .select('diagram')
        .eq('id', workflowId)
        .single()
      if (wf?.diagram) {
        diagramUpdated(wf.diagram)
      }
    })()
  }, [workflowId, supabase, diagramUpdated])

  const handleSend = async () => {
    const content = input.trim()
    if (!content || loading) return
    setLoading(true)
    setStreaming(true)
    setShowToast(false)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')

    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: 'assistant',
      content: ''
    }
    setMessages(prev => [...prev, assistantMessage])

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, phase: 'parse' })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }
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
      setStreaming(false)

      const match = acc.match(/```json\s*([\s\S]*?)```/)
      let diagramJson: any = null
      if (match) {
        try {
          diagramJson = JSON.parse(match[1])
          diagramUpdated(diagramJson)
        } catch (err) {
          console.error('Failed to parse JSON', err)
        }
      }

      let wfId = workflowId
      if (!workflowId && diagramJson) {
        const { data } = await supabase
          .from('workflows')
          .insert({ diagram: diagramJson })
          .select('id')
          .single()
        wfId = data?.id || null
        if (wfId) {
          onWorkflowCreated(wfId)
          await supabase.from('messages').insert(
            updatedMessages
              .concat({ ...assistantMessage, content: acc })
              .map(m => ({
                workflow_id: wfId,
                role: m.role,
                content: m.content
              }))
          )
        }
      } else if (wfId) {
        await supabase.from('messages').insert([
          { workflow_id: wfId, role: 'user', content: userMessage.content },
          { workflow_id: wfId, role: 'assistant', content: acc }
        ])
      }
    } catch (err) {
      console.error('Request failed', err)
      setMessages(prev => prev.filter(m => m.id !== assistantMessage.id && m.id !== userMessage.id))
      setInput(content)
      setShowToast(true)
    } finally {
      setLoading(false)
      setStreaming(false)
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
        {streaming && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      {showToast && (
        <Toast
          message="Something went wrong."
          actionLabel="Retry"
          onAction={() => {
            setShowToast(false)
            handleSend()
          }}
          onClose={() => setShowToast(false)}
        />
      )}
      <textarea
        style={{ resize: 'none' }}
        rows={3}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={loading}
      />
    </div>
  );
}
