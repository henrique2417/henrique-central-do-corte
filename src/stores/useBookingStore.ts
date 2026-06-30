import { create } from 'zustand'

export interface Service {
  id: string
  titulo: string
  descricao: string | null
  duracao_minutos: number
  preco: number
  status: string
  createdAt?: string
  updatedAt?: string
}

// Para retrocompatibilidade com a store de agendamento do administrador (English names)
export interface BarberService {
  id: string
  name: string
  description: string
  durationMinutes: number
  price: number
}


interface BookingState {
  // Estados
  selectedService: Service | null
  selectedDate: string | Date | null // Formato "YYYY-MM-DD" ou objeto Date
  selectedTime: string | null // Formato "HH:MM", ex: "14:30"
  isSubmitting: boolean

  // Ações
  setSelectedService: (service: Service | null) => void
  setSelectedDate: (date: string | Date | null) => void
  setSelectedTime: (time: string | null) => void
  clearBooking: () => void
  confirmBooking: () => Promise<boolean>

  // Estado derivado / Função para calcular o total
  getTotal: () => number
}

export const useBookingStore = create<BookingState>((set, get) => ({
  // Estados Iniciais
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  isSubmitting: false,

  // Ações
  setSelectedService: (service) => {
    // Ao trocar de serviço, resetamos o horário selecionado por questões de disponibilidade do novo serviço
    set({ selectedService: service, selectedTime: null })
  },

  setSelectedDate: (date) => {
    // Ao trocar a data, resetamos o horário selecionado para obrigar o cliente a selecionar uma nova vaga
    set({ selectedDate: date, selectedTime: null })
  },

  setSelectedTime: (time) => {
    set({ selectedTime: time })
  },

  clearBooking: () => {
    set({
      selectedService: null,
      selectedDate: null,
      selectedTime: null,
      isSubmitting: false,
    })
  },

  confirmBooking: async () => {
    const { selectedService, selectedDate, selectedTime } = get()
    if (!selectedService || !selectedDate || !selectedTime) {
      return false
    }

    set({ isSubmitting: true })

    // Simulação temporária de envio (será integrada com a API real futuramente)
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        set({ isSubmitting: false })
        resolve(true)
      }, 1000)
    })
  },

  // Estado derivado para obter o total do carrinho
  getTotal: () => {
    const service = get().selectedService
    return service ? service.preco : 0
  }
}))
