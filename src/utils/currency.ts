/**
 * Formata um número como valor monetário em Real Brasileiro (BRL)
 * Ex: 45.5 -> R$ 45,50
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}
