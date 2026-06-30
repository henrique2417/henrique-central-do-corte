import { useState } from 'react'
import { useBookingStore } from '../../stores/useBookingStore'
import './DateTimeSelector.css'

// Simulando horários disponíveis
const AVAILABLE_TIMES = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00"]

export default function DateTimeSelector() {
  const { selectedDate, setSelectedDate, selectedTime, setSelectedTime } = useBookingStore()
  
  // Simples seletor de dias para a semana atual
  const [days] = useState(() => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      dates.push(date)
    }
    return dates
  })

  return (
    <div className="date-time-selector">
      <h2 className="section-title">2. Escolha Data e Hora</h2>
      
      <div className="calendar-grid">
        {days.map((date) => {
          const dateString = date.toISOString().split('T')[0]
          return (
            <button
              key={dateString}
              className={`day-button ${selectedDate === dateString ? 'selected' : ''}`}
              onClick={() => setSelectedDate(dateString)}
            >
              <span>{date.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
              <strong>{date.getDate()}</strong>
            </button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="time-grid">
          {AVAILABLE_TIMES.map((time) => (
            <button
              key={time}
              className={`time-button ${selectedTime === time ? 'selected' : ''}`}
              onClick={() => setSelectedTime(time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
