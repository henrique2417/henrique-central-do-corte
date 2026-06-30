import React, { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { useScheduleStore } from '../../stores/useScheduleStore'
import { formatCurrency } from '../../utils/currency'
import { ConfirmPrompt } from '../../components/feedback/ConfirmPrompt'
import './AppointmentOffcanvas.css'

interface Appointment {
  id: string
  time: string
  clientName: string
  service: string
  price: number
  status: 'CONFIRMADO' | 'PENDENTE' | 'CANCELADO'
}

interface AppointmentOffcanvasProps {
  isOpen: boolean
  onClose: () => void
  appointment: Appointment | null
  onCancelSuccess: (id: string) => void
}

export const AppointmentOffcanvas: React.FC<AppointmentOffcanvasProps> = ({
  isOpen,
  onClose,
  appointment,
  onCancelSuccess,
}) => {
  const addToast = useScheduleStore((state) => state.addToast)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  if (!isOpen || !appointment) return null

  const handleClose = () => {
    setIsConfirmOpen(false)
    onClose()
  }

  const handleCancelAppointment = () => {
    // PREVENÇÃO DE ERROS: Abre o prompt secundário customizado
    setIsConfirmOpen(true)
  }

  const handleConfirmCancel = () => {
    onCancelSuccess(appointment.id)
    addToast('Agendamento cancelado com sucesso. Horário liberado!', 'success')
    setIsConfirmOpen(false)
    onClose()
  }

  const handleReschedule = () => {
    addToast('A funcionalidade de reagendamento estará disponível em breve!', 'success')
  }

  return (
    <>
      {/* Backdrop escurecido */}
      <div className="offcanvas-backdrop" onClick={handleClose}></div>

      {/* Painel lateral direito que desliza para dentro da tela */}
      <div className="offcanvas-panel" onClick={(e) => e.stopPropagation()}>
        <div className="offcanvas-header">
          <div className="header-title-container">
            <span className="offcanvas-badge">Detalhes da Reserva</span>
            <h2 className="offcanvas-title">Agendamento de Horário</h2>
          </div>
          <button className="btn-close" onClick={handleClose} title="Fechar painel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="offcanvas-body">
          {/* Card elegante com os detalhes do agendamento focado */}
          <div className="appointment-details-card">
            <div className="detail-row border-bottom">
              <span className="detail-label">Cliente</span>
              <span className="detail-value text-white highlight">{appointment.clientName}</span>
            </div>

            <div className="detail-row border-bottom">
              <span className="detail-label">Serviço Selecionado</span>
              <span className="detail-value text-accent">{appointment.service}</span>
            </div>

            <div className="detail-row border-bottom">
              <span className="detail-label">Horário agendado</span>
              <span className="detail-value text-white flex-align-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="icon-margin-right"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                {appointment.time}
              </span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Preço</span>
              <span className="detail-value text-white price-tag">{formatCurrency(appointment.price)}</span>
            </div>
          </div>

          <div className="status-indicator">
            <span className="dot dot-confirmed animate-pulse"></span>
            <span className="status-text">Este agendamento está ativo e confirmado no sistema.</span>
          </div>
        </div>

        <div className="offcanvas-footer">
          {/* Ações disponíveis */}
          <Button
            variant="outline"
            fullWidth
            onClick={handleReschedule}
          >
            Remarcar
          </Button>

          <Button
            variant="danger"
            fullWidth
            onClick={handleCancelAppointment}
          >
            Cancelar Agendamento
          </Button>
        </div>
      </div>

      <ConfirmPrompt
        isOpen={isConfirmOpen}
        title="Cancelar Agendamento"
        message={`Deseja realmente cancelar o agendamento de ${appointment.clientName} às ${appointment.time}?`}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  )
}
