'use client'

import ChatPanel from '../components/ChatPanel'
import DiagramPanel from '../components/DiagramPanel'
import { DiagramProvider } from '../components/DiagramContext'
import AuthModal from '../components/AuthModal'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

export default function Page() {
  const supabase = getSupabaseClient()
  const [showAuth, setShowAuth] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

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

  return (
    <DiagramProvider>
      <div className="flex h-screen">
        <div className="w-2/5 border-r border-gray-200 p-2 space-y-2">
          <div>
            {!loggedIn && <button onClick={() => setShowAuth(true)}>Login</button>}
            {loggedIn && <button onClick={signOut}>Logout</button>}
          </div>
          <ChatPanel />
        </div>
        <div className="w-3/5">
          <DiagramPanel />
        </div>
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </DiagramProvider>
  )
}

