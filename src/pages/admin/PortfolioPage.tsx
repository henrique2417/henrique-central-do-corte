import { useEffect, useState } from 'react'
import AdminLayout from '../../layouts/AdminLayout'
import { Button } from '../../components/ui/Button'
import { api } from '../../services/api'
import { formatCurrency } from '../../utils/currency'
import { useScheduleStore } from '../../stores/useScheduleStore'
import { ServiceModal } from '../../features/admin/ServiceModal'
import { LoadingSpinner } from '../../components/ui/LoadingSpinner'
import './PortfolioPage.css'

interface BarberService {
  id: string
  titulo: string
  descricao: string | null
  duracao_minutos: number
  preco: number
  status: string // 'ATIVO' | 'INATIVO'
}

export default function PortfolioPage() {
  const [services, setServices] = useState<BarberService[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Estados para controle do Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<BarberService | null>(null)
  
  const addToast = useScheduleStore((state) => state.addToast)

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleOpenCreate = () => {
    setSelectedService(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (service: BarberService) => {
    setSelectedService(service)
    setIsModalOpen(true)
  }

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await api.get<BarberService[]>('/services')
        if (isMounted) {
          setServices(data || [])
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Não foi possível carregar os serviços.'
        if (isMounted) {
          setError(errorMessage)
          addToast(errorMessage, 'error')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [refreshTrigger, addToast])

  return (
    <AdminLayout>
      <div className="portfolio-container">
        {/* Topo com Título e Botão Primário (Dourado) */}
        <div className="portfolio-header">
          <div className="header-titles">
            <h1 className="portfolio-title">Portfólio de Serviços</h1>
            <p className="portfolio-subtitle">Gerencie os serviços, valores e status oferecidos aos clientes.</p>
          </div>
          <Button variant="primary" size="md" onClick={handleOpenCreate}>
            <svg
              className="btn-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Novo Serviço</span>
          </Button>
        </div>

        {/* Tabela de Dados Horizontal Limpa */}
        <div className="portfolio-content">
          {isLoading ? (
            <div className="portfolio-loading-container">
              <LoadingSpinner size="lg" />
              <p>Buscando serviços no portfólio...</p>
            </div>
          ) : error ? (
            <div className="portfolio-error-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="error-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>Ocorreu um erro</h3>
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                Tentar Novamente
              </Button>
            </div>
          ) : services.length === 0 ? (
            <div className="portfolio-empty-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="empty-icon"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <h3>Nenhum serviço encontrado</h3>
              <p>Cadastre o primeiro serviço para começar a exibir aos seus clientes.</p>
              <Button variant="primary" size="sm" onClick={handleOpenCreate}>
                Cadastrar Serviço
              </Button>
            </div>
          ) : (
            <div className="portfolio-table-wrapper">
              <table className="portfolio-table">
                <thead>
                  <tr>
                    <th>Nome do Serviço</th>
                    <th>Descrição</th>
                    <th>Duração Média</th>
                    <th>Preço</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td className="font-semibold text-white">{service.titulo}</td>
                      <td className="text-desc" title={service.descricao || ''}>
                        {service.descricao || <span className="text-muted">—</span>}
                      </td>
                      <td>{service.duracao_minutos} minutos</td>
                      <td className="font-semibold text-accent">{formatCurrency(service.preco)}</td>
                      <td className="text-center">
                        <span className={`status-badge ${service.status.toLowerCase() === 'ativo' ? 'status-ativo' : 'status-inativo'}`}>
                          {service.status.toLowerCase() === 'ativo' ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn-action-edit"
                          title={`Editar ${service.titulo}`}
                          onClick={() => handleOpenEdit(service)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Criação e Edição de Serviços com Reset Automático via Key */}
      <ServiceModal
        key={isModalOpen ? (selectedService?.id || 'new') : 'closed'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSaveSuccess={handleRefresh}
      />
    </AdminLayout>
  )
}
