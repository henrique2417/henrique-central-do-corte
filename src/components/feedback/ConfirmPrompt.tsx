import React from 'react'
import { Button } from '../ui/Button'
import './ConfirmPrompt.css'

interface ConfirmPromptProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmPrompt: React.FC<ConfirmPromptProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div className="prompt-backdrop" onClick={onCancel}>
      <div className="prompt-content" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="prompt-warning-icon"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <h3 className="prompt-title">{title}</h3>
        </div>

        <div className="prompt-body">
          <p className="prompt-message">{message}</p>
        </div>

        <div className="prompt-actions">
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="danger" size="md" onClick={onConfirm} className="btn-confirm-danger">
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  )
}
