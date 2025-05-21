import React, { useEffect, useState } from 'react'

export default function TypingIndicator() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const id = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
    }, 500)
    return () => clearInterval(id)
  }, [])

  return <div style={{ padding: '0.25rem 0' }}>Assistant is typing{dots}</div>
}
