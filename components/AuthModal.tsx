'use client'

import { useState, FormEvent } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'

interface AuthModalProps {
  open: boolean
  onClose: () => void
}

export default function AuthModal({ open, onClose }: AuthModalProps) {
  const supabase = getSupabaseClient()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.href }
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for a login link.')
    }
    setLoading(false)
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{ background: '#fff', padding: '1rem', width: '300px' }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
        {message && <p style={{ marginTop: '0.5rem' }}>{message}</p>}
      </div>
    </div>
  )
}
