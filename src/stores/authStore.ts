import { create } from 'zustand';
import { api } from '../services/api';
import { useScheduleStore } from './useScheduleStore';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENTE' | 'ADMIN';
  createdAt?: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Ações
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: 'CLIENTE' | 'ADMIN') => Promise<boolean>;
  logout: () => void;
  
  // Utilitário para atualizar dados de perfil do usuário (ex: se necessário posteriormente)
  updateUserLocal: (userData: Partial<User>) => void;
}

// Recuperação inicial do estado a partir do localStorage para persistência de sessão
const storedToken = localStorage.getItem('central_do_corte_token') || null;
const storedUserJson = localStorage.getItem('central_do_corte_user');
let storedUser: User | null = null;

if (storedUserJson) {
  try {
    storedUser = JSON.parse(storedUserJson) as User;
  } catch (error) {
    console.error('Erro ao carregar os dados do usuário a partir do localStorage:', error);
    localStorage.removeItem('central_do_corte_user');
    localStorage.removeItem('central_do_corte_token');
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken && !!storedUser,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { token, user, message } = response;

      // Salva no localStorage para persistência entre reloads
      localStorage.setItem('central_do_corte_token', token);
      localStorage.setItem('central_do_corte_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Feedback imediato utilizando o sistema de Toasts do useScheduleStore
      useScheduleStore.getState().addToast(message || 'Login realizado com sucesso!', 'success');
      return true;
    } catch (error) {
      set({ isLoading: false });
      const errorMessage = error instanceof Error ? error.message : 'Erro ao realizar login. Tente novamente.';
      
      // Feedback imediato de erro utilizando o sistema de Toasts
      useScheduleStore.getState().addToast(errorMessage, 'error');
      return false;
    }
  },

  register: async (name, email, password, role = 'CLIENTE') => {
    set({ isLoading: true });
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
        role,
      });

      const { token, user, message } = response;

      // Cadastro com login automático opcional (conforme o backend que retorna o token no cadastro)
      localStorage.setItem('central_do_corte_token', token);
      localStorage.setItem('central_do_corte_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Feedback imediato de sucesso utilizando o sistema de Toasts
      useScheduleStore.getState().addToast(message || 'Cadastro realizado com sucesso!', 'success');
      return true;
    } catch (error) {
      set({ isLoading: false });
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar usuário. Tente novamente.';
      
      // Feedback imediato de erro utilizando o sistema de Toasts
      useScheduleStore.getState().addToast(errorMessage, 'error');
      return false;
    }
  },

  logout: () => {
    // Remove os tokens e as credenciais do localStorage
    localStorage.removeItem('central_do_corte_token');
    localStorage.removeItem('central_do_corte_user');

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    // Feedback imediato utilizando o sistema de Toasts
    useScheduleStore.getState().addToast('Sessão encerrada com sucesso.', 'success');
  },

  updateUserLocal: (userData) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('central_do_corte_user', JSON.stringify(updatedUser));
    
    set({ user: updatedUser });
  }
}));
