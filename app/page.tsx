'use client'

import ChatPanel from '../components/ChatPanel'
import DiagramPanel from '../components/DiagramPanel'
import HistorySidebar, { type Workflow } from '../components/HistorySidebar'
import { DiagramProvider } from '../components/DiagramContext'
import AuthModal from '../components/AuthModal'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export default function Page() {
  const supabase = getSupabaseClient()
  const [showAuth, setShowAuth] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [workflowId, setWorkflowId] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session)
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const handleSelect = (wf: Workflow) => {
    setWorkflowId(wf.id)
  }

  return (
    <DiagramProvider>
      <div className="flex h-screen">
        <div className="w-1/5 border-r border-gray-200">
          <HistorySidebar onSelect={handleSelect} />
        </div>
        <div className="w-2/5 border-r border-gray-200 p-2 space-y-2">
          <div>
            {!loggedIn && <button onClick={() => setShowAuth(true)}>Login</button>}
            {loggedIn && <button onClick={signOut}>Logout</button>}
          </div>
          <ChatPanel workflowId={workflowId} onWorkflowCreated={setWorkflowId} />
        </div>
        <div className="w-2/5">
          <DiagramPanel />
        </div>
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </DiagramProvider>
  )
}

