import { create } from 'zustand'
import type { BarberService } from './useBookingStore'

export interface Appointment {
  id: string
  clientName: string
  clientPhone: string
  service: BarberService
  date: string // YYYY-MM-DD
  time: string // HH:MM
  status: 'confirmed' | 'cancelled'
}

export interface DailyMetrics {
  totalCuts: number
  expectedRevenue: number
  occupancyRate: number // porcentagem, ex: 75
}

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning'
}

interface ScheduleState {
  appointments: Appointment[]
  services: BarberService[]
  metrics: DailyMetrics
  selectedAppointmentForAction: Appointment | null // Gerencia o Offcanvas lateral
  selectedServiceForEdit: BarberService | null // Gerencia o Modal de Edição
  toasts: ToastMessage[]

  // Ações de Toast
  addToast: (message: string, type: 'success' | 'error' | 'warning') => void
  removeToast: (id: string) => void

  // Ações de Agendamento (Admin)
  fetchDailyAppointments: (date: string) => Promise<void>
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => Promise<boolean>
  cancelAppointment: (appointmentId: string) => Promise<boolean>
  setSelectedAppointmentForAction: (appointment: Appointment | null) => void

  // Ações de Portfólio (Serviços)
  fetchServices: () => Promise<void>
  addService: (service: Omit<BarberService, 'id'>) => Promise<boolean>
  updateService: (id: string, service: Omit<BarberService, 'id'>) => Promise<boolean>
  deleteService: (id: string) => Promise<boolean>
  setSelectedServiceForEdit: (service: BarberService | null) => void
}

// Dados mockados iniciais para simular a reatividade da arquitetura
const INITIAL_SERVICES: BarberService[] = [
  { id: 's1', name: 'Corte Degradê', description: 'Acabamento moderno nas laterais e ajuste de topo', durationMinutes: 30, price: 45.00 },
  { id: 's2', name: 'Barba Completa', description: 'Alinhamento na navalha com toalha quente e balm', durationMinutes: 30, price: 35.00 },
  { id: 's3', name: 'Combo Cabelo + Barba', description: 'O serviço completo para renovar o visual premium', durationMinutes: 60, price: 70.00 },
  { id: 's4', name: 'Platinado / Nevou', description: 'Descoloração global e matização premium', durationMinutes: 120, price: 120.00 }
]

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'Bruno Alencar', clientPhone: '11988887777', service: INITIAL_SERVICES[0], date: '2026-06-17', time: '08:00', status: 'confirmed' },
  { id: 'a2', clientName: 'Thiago Mendes', clientPhone: '11977776666', service: INITIAL_SERVICES[2], date: '2026-06-17', time: '09:00', status: 'confirmed' },
  { id: 'a3', clientName: 'Rodrigo Silva', clientPhone: '11966665555', service: INITIAL_SERVICES[1], date: '2026-06-17', time: '10:30', status: 'confirmed' },
  { id: 'a4', clientName: 'Felipe Ramos', clientPhone: '11955554444', service: INITIAL_SERVICES[0], date: '2026-06-17', time: '11:30', status: 'confirmed' }
]

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  appointments: INITIAL_APPOINTMENTS,
  services: INITIAL_SERVICES,
  metrics: {
    totalCuts: 4,
    expectedRevenue: 195.00,
    occupancyRate: 50
  },
  selectedAppointmentForAction: null,
  selectedServiceForEdit: null,
  toasts: [],

  // Toast Management
  addToast: (message, type) => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }))
    // Auto remove após 4 segundos
    setTimeout(() => {
      get().removeToast(id)
    }, 4000)
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  },

  // Appointments Management
  fetchDailyAppointments: async (date) => {
    // Simula filtragem por data na API
    console.log(`Buscando agendamentos para a data ${date}...`)
  },

  rescheduleAppointment: async (appointmentId, newDate, newTime) => {
    let success = false
    set((state) => {
      const updatedAppointments = state.appointments.map((app) => {
        if (app.id === appointmentId) {
          success = true
          return { ...app, date: newDate, time: newTime }
        }
        return app
      })
      return { appointments: updatedAppointments }
    })
    
    if (success) {
      get().addToast('Agendamento remarcado com sucesso!', 'success')
    }
    return success
  },

  cancelAppointment: async (appointmentId) => {
    let success = false
    set((state) => {
      const updatedAppointments = state.appointments.map((app) => {
        if (app.id === appointmentId) {
          success = true
          return { ...app, status: 'cancelled' as const }
        }
        return app
      })
      // Filtra ou atualiza as métricas
      const activeApps = updatedAppointments.filter(a => a.status === 'confirmed' && a.date === '2026-06-17')
      const totalCuts = activeApps.length
      const expectedRevenue = activeApps.reduce((acc, curr) => acc + curr.service.price, 0)
      const occupancyRate = Math.round((totalCuts / 12) * 100) // Assumindo 12 slots por dia

      return { 
        appointments: updatedAppointments,
        metrics: { totalCuts, expectedRevenue, occupancyRate }
      }
    })

    if (success) {
      get().addToast('Agendamento cancelado com sucesso. Horário liberado!', 'success')
    }
    return success
  },

  setSelectedAppointmentForAction: (appointment) => {
    set({ selectedAppointmentForAction: appointment })
  },

  // Services Portfolio Management
  fetchServices: async () => {
    // Buscar serviços reais do servidor
  },

  addService: async (serviceData) => {
    const id = 's' + (get().services.length + 1)
    const newService: BarberService = { ...serviceData, id }
    set((state) => ({
      services: [...state.services, newService]
    }))
    get().addToast(`Serviço "${newService.name}" criado com sucesso!`, 'success')
    return true
  },

  updateService: async (id, serviceData) => {
    let success = false
    set((state) => {
      const updatedServices = state.services.map((s) => {
        if (s.id === id) {
          success = true
          return { ...s, ...serviceData }
        }
        return s
      })
      return { services: updatedServices }
    })

    if (success) {
      get().addToast('Serviço atualizado com sucesso!', 'success')
    }
    return success
  },

  deleteService: async (id) => {
    let success = false
    const serviceName = get().services.find(s => s.id === id)?.name
    
    set((state) => {
      const exists = state.services.some((s) => s.id === id)
      if (exists) {
        success = true
        return {
          services: state.services.filter((s) => s.id !== id)
        }
      }
      return state
    })

    if (success) {
      get().addToast(`Serviço "${serviceName}" excluído com sucesso!`, 'success')
    }
    return success
  },

  setSelectedServiceForEdit: (service) => {
    set({ selectedServiceForEdit: service })
  }
}))
