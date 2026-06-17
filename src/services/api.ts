// Simulação de chamadas HTTP com atraso (Mocks de API)
export const api = {
  get: async <T>(url: string): Promise<T> => {
    console.log(`[API GET] chamando: ${url}`)
    return new Promise((resolve) => setTimeout(resolve, 300))
  },
  post: async <T>(url: string, data: unknown): Promise<T> => {
    console.log(`[API POST] chamando: ${url}`, data)
    return new Promise((resolve) => setTimeout(resolve, 300))
  },
  put: async <T>(url: string, data: unknown): Promise<T> => {
    console.log(`[API PUT] chamando: ${url}`, data)
    return new Promise((resolve) => setTimeout(resolve, 300))
  },
  delete: async <T>(url: string): Promise<T> => {
    console.log(`[API DELETE] chamando: ${url}`)
    return new Promise((resolve) => setTimeout(resolve, 300))
  }
}
