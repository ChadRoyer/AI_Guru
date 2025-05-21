import React from 'react'

interface ToastProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose?: () => void
}

export default function Toast({ message, actionLabel, onAction, onClose }: ToastProps) {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        background: '#333',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 1000
      }}
    >
      <span>{message}</span>
      {actionLabel && (
        <button
          onClick={onAction}
          style={{
            background: 'transparent',
            border: '1px solid #fff',
            color: '#fff',
            padding: '0.25rem 0.5rem',
            cursor: 'pointer'
          }}
        >
          {actionLabel}
        </button>
      )}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
