import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export interface Workflow {
  id: string
  created_at: string
  diagram: any
}

interface Props {
  onSelect: (wf: Workflow) => void
}

export default function HistorySidebar({ onSelect }: Props) {
  const supabase = getSupabaseClient()
  const [workflows, setWorkflows] = useState<Workflow[]>([])

  useEffect(() => {
    supabase
      .from('workflows')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setWorkflows(data ?? [])
      })
  }, [supabase])

  return (
    <div className="p-2 space-y-1 overflow-y-auto" style={{ height: '100%' }}>
      {workflows.map(wf => (
        <div key={wf.id}>
          <button
            onClick={() => onSelect(wf)}
            style={{ width: '100%', textAlign: 'left' }}
          >
            {new Date(wf.created_at).toLocaleString()}
          </button>
        </div>
      ))}
    </div>
  )
}
