// Cliente HTTP inteligente: integra requisições reais do backend para autenticação
// e mantém simulação temporária para rotas ainda não implementadas no backend.

const BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:4000';

// Verifica se a URL é de autenticação ou serviços para direcionar ao backend real
const isRealUrl = (url: string) => url.includes('/auth/') || url.includes('/services');

export const api = {
  get: async <T>(url: string): Promise<T> => {
    console.log(`[API GET] chamando: ${url}`);
    
    if (isRealUrl(url)) {
      const token = localStorage.getItem('central_do_corte_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api${url}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar requisição no servidor.');
      }

      return response.json();
    } else {
      // Mock/Simulação para rotas futuras
      return new Promise((resolve) => setTimeout(resolve, 300)) as Promise<T>;
    }
  },

  post: async <T>(url: string, data: unknown): Promise<T> => {
    console.log(`[API POST] chamando: ${url}`, data);

    if (isRealUrl(url)) {
      const token = localStorage.getItem('central_do_corte_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api${url}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar requisição no servidor.');
      }

      return response.json();
    } else {
      // Mock/Simulação para rotas futuras
      return new Promise((resolve) => setTimeout(resolve, 300)) as Promise<T>;
    }
  },

  put: async <T>(url: string, data: unknown): Promise<T> => {
    console.log(`[API PUT] chamando: ${url}`, data);

    if (isRealUrl(url)) {
      const token = localStorage.getItem('central_do_corte_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api${url}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar requisição no servidor.');
      }

      return response.json();
    } else {
      // Mock/Simulação para rotas futuras
      return new Promise((resolve) => setTimeout(resolve, 300)) as Promise<T>;
    }
  },

  delete: async <T>(url: string): Promise<T> => {
    console.log(`[API DELETE] chamando: ${url}`);

    if (isRealUrl(url)) {
      const token = localStorage.getItem('central_do_corte_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/api${url}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao processar requisição no servidor.');
      }

      return response.json();
    } else {
      // Mock/Simulação para rotas futuras
      return new Promise((resolve) => setTimeout(resolve, 300)) as Promise<T>;
    }
  }
};
