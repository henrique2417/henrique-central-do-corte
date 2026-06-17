type WebSocketListener = (event: string, data: any) => void

class WebSocketMockService {
  private listeners: Map<string, WebSocketListener[]> = new Map()
  private pollingIntervalId: number | null = null

  // Conecta e simula atualizações assíncronas
  connect() {
    console.log('[WS] Conectando ao servidor em tempo real (Mock)...')
    
    // Simula Polling/Eventos recebidos a cada 25 segundos para manter a sincronia
    if (!this.pollingIntervalId) {
      this.pollingIntervalId = window.setInterval(() => {
        this.simulateIncomingUpdate()
      }, 25000)
    }
  }

  disconnect() {
    console.log('[WS] Desconectado.')
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId)
      this.pollingIntervalId = null
    }
  }

  subscribe(event: string, callback: WebSocketListener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)

    return () => this.unsubscribe(event, callback)
  }

  private unsubscribe(event: string, callback: WebSocketListener) {
    const list = this.listeners.get(event)
    if (list) {
      this.listeners.set(event, list.filter(cb => cb !== callback))
    }
  }

  // Simula o recebimento de uma mensagem do servidor
  private simulateIncomingUpdate() {
    // Tipos de atualizações em tempo real comuns
    const updates = ['APPOINTMENT_CREATED', 'APPOINTMENT_CANCELLED']
    const randomUpdate = updates[Math.floor(Math.random() * updates.length)]
    
    console.log(`[WS Real-time Event] Recebido do servidor: ${randomUpdate}`)
    
    const listenersForEvent = this.listeners.get(randomUpdate)
    if (listenersForEvent) {
      listenersForEvent.forEach(cb => cb(randomUpdate, { timestamp: Date.now() }))
    }
  }

  // Simula a emissão de uma mensagem para o servidor
  emit(event: string, data: any) {
    console.log(`[WS Sent] Emitindo evento para o servidor: ${event}`, data)
  }
}

export const wsService = new WebSocketMockService()
