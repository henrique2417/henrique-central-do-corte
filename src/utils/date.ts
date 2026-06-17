/**
 * Retorna uma data em formato legível em português (ex: "Quarta-feira, 17 de Junho")
 */
export function formatFriendlyDate(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00') // evita problemas de timezone local
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date)
}

/**
 * Retorna a data atual no formato YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Gera os slots de tempo de atendimento baseados no horário de funcionamento (08h às 20h)
 * com intervalos definidos em minutos (ex: 30 minutos)
 */
export function generateTimeSlots(intervalMinutes = 30): string[] {
  const slots: string[] = []
  const startHour = 8
  const endHour = 20

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      const hh = String(hour).padStart(2, '0')
      const mm = String(min).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  // Adiciona o horário final limite
  slots.push(`${endHour}:00`)
  
  return slots
}
