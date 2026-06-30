import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { formatFriendlyDate, getTodayDateString } from '../../utils/date'
import { useAuthStore } from '../../stores/authStore'
import './DashboardHeader.css'

export default function DashboardHeader() {
  const user = useAuthStore((state) => state.user)
  const todayStr = getTodayDateString()
  const displayDate = formatFriendlyDate(todayStr)

  // Dados mockados conforme solicitado
  const metrics = [
    {
      label: 'Total de Cortes Hoje',
      value: '12',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      ),
      color: 'var(--accent)'
    },
    {
      label: 'Previsão de Receita',
      value: 'R$ 540,00',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      color: 'var(--status-success)'
    },
    {
      label: 'Taxa de Ocupação',
      value: '85%',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      color: 'var(--status-warning)'
    }
  ]

  return (
    <div className="dashboard-header-container">
      <div className="header-top">
        <div className="header-greeting">
          <h1>Olá, {user?.name || 'Admin'}</h1>
          <p className="current-date">{displayDate}</p>
        </div>
        <Button variant="primary" size="lg" className="btn-new-appointment">
          <span className="btn-icon">+</span>
          <span>Novo Agendamento</span>
        </Button>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <Card key={index} className="metric-card" padding="lg">
            <div className="metric-content">
              <div className="metric-info">
                <span className="metric-label">{metric.label}</span>
                <span className="metric-value">{metric.value}</span>
              </div>
              <div className="metric-icon-wrapper" style={{ color: metric.color }}>
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
