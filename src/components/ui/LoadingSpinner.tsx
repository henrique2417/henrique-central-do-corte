import React from 'react'
import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner spinner-${size}`} role="status">
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  )
}
