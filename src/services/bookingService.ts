import { api } from './api'
import { BarberService } from '../stores/useBookingStore'
import { Appointment } from '../stores/useScheduleStore'

export const bookingService = {
  // Busca lista de serviços disponíveis
  getServices: async (): Promise<BarberService[]> => {
    return api.get<BarberService[]>('/services')
  },

  // Busca horários indisponíveis/ocupados para um dia específico
  getOccupiedSlots: async (date: string): Promise<string[]> => {
    return api.get<string[]>(`/appointments/occupied?date=${date}`)
  },

  // Cria um novo agendamento de cliente
  createBooking: async (bookingData: {
    serviceId: string
    date: string
    time: string
    clientName: string
    clientPhone: string
  }): Promise<Appointment> => {
    return api.post<Appointment>('/appointments', bookingData)
  },

  // Altera a data ou horário de um agendamento existente
  rescheduleBooking: async (id: string, date: string, time: string): Promise<boolean> => {
    await api.put(`/appointments/${id}/reschedule`, { date, time })
    return true
  },

  // Cancela um agendamento
  cancelBooking: async (id: string): Promise<boolean> => {
    await api.delete(`/appointments/${id}`)
    return true
  }
}
