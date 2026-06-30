import { useState, useEffect } from 'react'
import { Card } from '../../components/ui/Card'
import { generateTimeSlots } from '../../utils/date'
import { AppointmentOffcanvas } from './AppointmentOffcanvas'
import { useAuthStore } from '../../stores/authStore'
import './AgendaTimeline.css'

interface Appointment {
  id: string
  time: string
  clientName: string
  service: string
  price: number
  status: 'CONFIRMADO' | 'PENDENTE' | 'CANCELADO'
}

export default function AgendaTimeline() {
  const timeSlots = generateTimeSlots(30)
  
  // Estado local para armazenar os agendamentos reais da API
  const [appointments, setAppointments] = useState<Appointment[]>([])

  // Estados do Offcanvas lateral direito
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const token = useAuthStore((state) => state.token)

  useEffect(() => {
    const fetchDailyAppointments = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
        const response = await fetch(`${baseUrl}/api/appointments/daily`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        })

        if (!response.ok) {
          throw new Error('Erro ao buscar agendamentos diários')
        }

        const data = await response.json()
        setAppointments(data)
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
      }
    }

    if (token) {
      fetchDailyAppointments()
    }
  }, [token])

  const getAppointmentAt = (time: string) => {
    // Retorna apenas agendamentos não cancelados para que lacunas voltem a ficar disponíveis cinza claro
    return appointments.find(app => app.time === time && app.status !== 'CANCELADO')
  }

  const handleOpenEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setIsOffcanvasOpen(true)
  }

  const handleCancelSuccess = (id: string) => {
    setAppointments(prev =>
      prev.map(app => (app.id === id ? { ...app, status: 'CANCELADO' } : app))
    )
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h2 className="timeline-title">Agenda do Dia</h2>
        <div className="timeline-legend">
          <span className="legend-item"><span className="dot dot-available"></span> Disponível</span>
          <span className="legend-item"><span className="dot dot-confirmed"></span> Confirmado</span>
        </div>
      </div>

      <div className="timeline-list">
        {timeSlots.map((time) => {
          const appointment = getAppointmentAt(time)
          
          return (
            <div key={time} className="timeline-slot">
              <div className="slot-time">
                <span>{time}</span>
              </div>
              
              <div className="slot-content">
                {appointment ? (
                  <Card className="appointment-card hover-elevate" padding="sm">
                    <div className="appointment-status-border"></div>
                    <div className="appointment-info">
                      <div className="client-header">
                        <span className="client-name">{appointment.clientName}</span>
                        <span className="appointment-price">R$ {appointment.price.toFixed(2)}</span>
                      </div>
                      <span className="service-name">{appointment.service}</span>
                    </div>
                    <div className="appointment-actions">
                       <button
                         className="btn-action"
                         title="Editar"
                         onClick={() => handleOpenEdit(appointment)}
                       >
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                       </button>
                    </div>
                  </Card>
                ) : (
                  <div className="empty-slot" title="Clique para agendar neste horário">
                    <span className="status-available">Disponível</span>
                    <span className="quick-add-icon">+</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Offcanvas para Remarcação ou Cancelamento de Reserva */}
      <AppointmentOffcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => setIsOffcanvasOpen(false)}
        appointment={selectedAppointment}
        onCancelSuccess={handleCancelSuccess}
      />
    </div>
  )
}
