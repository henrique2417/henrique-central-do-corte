import { create } from 'zustand'

export interface BarberService {
  id: string
  name: string
  description: string
  durationMinutes: number
  price: number
}

interface BookingState {
  selectedService: BarberService | null
  selectedDate: string | null // formato YYYY-MM-DD
  selectedTime: string | null // formato HH:MM
  isSubmitting: boolean
  
  // Ações
  selectService: (service: BarberService | null) => void
  selectDate: (date: string | null) => void
  selectTime: (time: string | null) => void
  resetBooking: () => void
  confirmBooking: () => Promise<boolean>
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  isSubmitting: false,

  selectService: (service) => {
    // Ao trocar o serviço, opcionalmente limpamos o horário selecionado
    // caso as agendas variem por tempo de serviço.
    set({ selectedService: service, selectedTime: null })
  },

  selectDate: (date) => {
    set({ selectedDate: date, selectedTime: null })
  },

  selectTime: (time) => {
    set({ selectedTime: time })
  },

  resetBooking: () => {
    set({ selectedService: null, selectedDate: null, selectedTime: null, isSubmitting: false })
  },

  confirmBooking: async () => {
    const { selectedService, selectedDate, selectedTime } = get()
    if (!selectedService || !selectedDate || !selectedTime) {
      return false
    }

    set({ isSubmitting: true })
    
    // Simular requisição de agendamento na API
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        set({ isSubmitting: false })
        resolve(true)
      }, 1000)
    })
  }
}))
