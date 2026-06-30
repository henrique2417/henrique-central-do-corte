import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import './LandingPage.css'

interface Service {
  id: string
  titulo: string
  descricao: string | null
  duracao_minutos: number
  preco: number
  status: string
}

export default function LandingPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, logout, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetch('http://localhost:4000/api/services')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Não foi possível carregar os serviços.')
        }
        return res.json()
      })
      .then((data: Service[]) => {
        const activeServices = data.filter((s) => s.status === 'ATIVO')
        setServices(activeServices)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao buscar serviços:', err)
        setError('Houve um problema ao carregar o portfólio de serviços.')
        setLoading(false)
      })
  }, [])

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  return (
    <div className="landing-container">
      {/* Header Fixo */}
      <header className="landing-header">
        <div className="header-logo">
          <span className="logo-text">CENTRAL DO <span className="highlight">CORTE</span></span>
        </div>
        <nav className="header-nav">
          <a href="#services" className="nav-link">Serviços</a>
          <a href="#about" className="nav-link">Sobre</a>
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">Olá, {user?.name.split(' ')[0]}</span>
              {user?.role === 'ADMIN' && (
                <Link to="/admin/agenda" className="nav-button admin-btn">Painel Admin</Link>
              )}
              <button onClick={logout} className="nav-link logout-btn">Sair</button>
            </div>
          ) : (
            <Link to="/login" className="nav-button login-btn">Entrar</Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Seu tempo é valioso.<br />Agende seu corte sem filas.</h1>
          <p className="hero-subtitle">
            Experimente o agendamento premium de forma autônoma e em tempo real na Central do Corte.
          </p>
          <button onClick={() => navigate('/agendar')} className="cta-button">
            Agende seu Corte
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2 className="section-title">Nosso Portfólio</h2>
        <p className="section-subtitle">Escolha o serviço ideal para o seu estilo</p>

        {loading && <div className="loading-state">Carregando portfólio de serviços...</div>}

        {error && <div className="error-state">{error}</div>}

        {!loading && !error && services.length === 0 && (
          <div className="empty-state">Nenhum serviço disponível no momento.</div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="card-header">
                  <h3 className="service-title">{service.titulo}</h3>
                  <span className="service-duration">{service.duracao_minutos} min</span>
                </div>
                {service.descricao && <p className="service-desc">{service.descricao}</p>}
                <div className="card-footer">
                  <span className="service-price">{formatPrice(service.preco)}</span>
                  <button onClick={() => navigate('/agendar')} className="card-cta">
                    Escolher
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-grid">
          <div className="about-text-content">
            <h2 className="about-title">Sobre a Barbearia</h2>
            <p>
              A Central do Corte é mais que um espaço para fazer a barba e o cabelo; é um ambiente focado na excelência e no respeito ao seu tempo. 
            </p>
            <p>
              Com profissionais altamente qualificados e uma estrutura premium pensada para o seu conforto, inovamos ao trazer o agendamento inteligente 100% autônomo. Escolha seu serviço, reserve seu horário e seja atendido sem atrasos e sem filas de espera.
            </p>
          </div>
          <div className="about-visual">
            <div className="visual-box">
              <span className="visual-badge">Desde 2026</span>
              <h3>Atendimento Personalizado</h3>
              <p>Qualidade que você sente. Tecnologia que você usa.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
