import { create } from 'zustand'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'client' | 'admin'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, role: 'client' | 'admin') => Promise<void>
  logout: () => void
  register: (name: string, email: string, phone: string) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, role) => {
    set({ isLoading: true })
    // TODO: Implementar login real integrado à API
    setTimeout(() => {
      set({
        user: {
          id: role === 'admin' ? 'admin-1' : 'client-1',
          name: role === 'admin' ? 'Barbeiro Chefe' : 'Cliente Especial',
          email,
          role,
        },
        isAuthenticated: true,
        isLoading: false,
      })
    }, 500)
  },

  logout: () => {
    set({ user: null, isAuthenticated: false })
  },

  register: async (name, email, phone) => {
    set({ isLoading: true })
    // TODO: Implementar registro real integrado à API
    setTimeout(() => {
      set({
        user: {
          id: 'client-new',
          name,
          email,
          phone,
          role: 'client',
        },
        isAuthenticated: true,
        isLoading: false,
      })
    }, 500)
  },
}))
