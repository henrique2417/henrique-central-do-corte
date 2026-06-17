import React from 'react'
import './Card.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  hoverable?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md'
}) => {
  const classes = [
    'card',
    hoverable ? 'card-hoverable' : '',
    `card-padding-${padding}`,
    className
  ].join(' ').trim()

  return (
    <div className={classes}>
      {children}
    </div>
  )
}
