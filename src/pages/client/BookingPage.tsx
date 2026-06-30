import { useNavigate } from 'react-router-dom'
import { useBookingStore } from '../../stores/useBookingStore'
import { useScheduleStore } from '../../stores/useScheduleStore'
import ServiceSelector from '../../features/booking/ServiceSelector'
import DateTimeSelector from '../../features/booking/DateTimeSelector'
import './BookingPage.css'

export default function BookingPage() {
  const navigate = useNavigate()
  const { 
    selectedService, 
    selectedDate, 
    selectedTime, 
    getTotal, 
    confirmBooking,
    isSubmitting 
  } = useBookingStore()
  
  const { addToast } = useScheduleStore()

  const isReady = !!(selectedService && selectedDate && selectedTime)

  const handleConfirm = async () => {
    if (!isReady) return

    const success = await confirmBooking()
    if (success) {
      addToast('Agendamento realizado com sucesso!', 'success')
      navigate('/')
    } else {
      addToast('Erro ao realizar agendamento. Tente novamente.', 'error')
    }
  }

  // Formatação de data amigável para o resumo
  const formatDate = (dateStr: string | Date | null) => {
    if (!dateStr) return ''
    const date = typeof dateStr === 'string' ? new Date(dateStr + 'T00:00:00') : dateStr
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Voltar
        </button>
        <h1>Agende seu Horário</h1>
      </header>

      <div className="booking-split-container">
        <div className="booking-left-col">
          <ServiceSelector />
        </div>
        <div className="booking-right-col">
          <DateTimeSelector />
        </div>
      </div>

      {/* Sticky Footer */}
      <footer className={`booking-footer ${isReady ? 'active' : ''}`}>
        <div className="footer-content">
          <div className="booking-summary">
            {isReady ? (
              <>
                <span className="summary-text">
                  <strong>{selectedService.titulo}</strong>
                </span>
                <span className="summary-details">
                  {formatDate(selectedDate)} às {selectedTime}
                </span>
              </>
            ) : (
              <span className="summary-placeholder">Selecione o serviço, data e hora para continuar</span>
            )}
          </div>
          
          <div className="booking-actions">
            <div className="total-container">
              <span className="total-label">Total:</span>
              <span className="total-value">R$ {getTotal().toFixed(2)}</span>
            </div>
            <button 
              className="confirm-btn" 
              disabled={!isReady || isSubmitting}
              onClick={handleConfirm}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Agendamento'}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
