'use client'

import { useEffect, useState } from 'react'
import DiagramOnly from '../../components/DiagramOnly'
import OpportunitiesPanel, { Opportunity } from '../../components/OpportunitiesPanel'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface DemoData {
  messages: Message[]
  nodes: any[]
  edges: any[]
  opportunities?: Opportunity[]
}

export default function DemoPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [diagram, setDiagram] = useState<{ nodes: any[]; edges: any[] }>({ nodes: [], edges: [] })
  const [opps, setOpps] = useState<Opportunity[]>([])

  useEffect(() => {
    let cancelled = false
    fetch('/demo-data.json')
      .then(res => res.json())
      .then((data: DemoData) => {
        async function play() {
          for (const msg of data.messages || []) {
            if (cancelled) return
            setMessages(prev => [...prev, msg])
            await new Promise(r => setTimeout(r, 150))
          }
          if (cancelled) return
          setDiagram({ nodes: data.nodes || [], edges: data.edges || [] })
          setOpps(data.opportunities || [])
        }
        play()
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="flex h-screen">
      <div className="w-2/5 border-r border-gray-200 p-2 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '0.25rem 0' }}>
            <strong>{m.role === 'user' ? 'You' : 'Assistant'}:</strong>
            <div>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="w-3/5 flex flex-col">
        <div style={{ flex: 1 }}>
          <DiagramOnly nodes={diagram.nodes} edges={diagram.edges} />
        </div>
        {opps.length > 0 && (
          <div style={{ borderTop: '1px solid #ccc' }}>
            <OpportunitiesPanel opportunities={opps} />
          </div>
        )}
      </div>
    </div>
  )
}
