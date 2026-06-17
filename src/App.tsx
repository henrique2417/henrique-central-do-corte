import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'

// Importação das páginas (Esqueletos)
import LandingPage from './pages/client/LandingPage'
import BookingPage from './pages/client/BookingPage'
import SchedulePage from './pages/admin/SchedulePage'
import PortfolioPage from './pages/admin/PortfolioPage'
import LoginPage from './pages/auth/LoginPage'

function App() {
  return (
    <Router>
      {/* Navegação Temporária para Testes */}
      <nav style={{ 
        padding: '1rem', 
        background: 'var(--surface)', 
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ fontWeight: 'bold', color: 'var(--accent)' }}>CLIENTE:</div>
        <Link typeof="button" to="/">Landing Page</Link>
        <Link to="/agendar">Agendamento</Link>
        
        <div style={{ fontWeight: 'bold', color: 'var(--accent)', marginLeft: '1rem' }}>ADMIN:</div>
        <Link to="/admin/agenda">Agenda (Timeline)</Link>
        <Link to="/admin/servicos">Portfólio</Link>
        
        <div style={{ marginLeft: 'auto' }}>
          <Link to="/login" style={{ color: 'var(--accent)' }}>Entrar</Link>
        </div>
      </nav>

      {/* Renderização das Rotas */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Fluxo Cliente */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/agendar" element={<BookingPage />} />
          
          {/* Fluxo Admin */}
          <Route path="/admin/agenda" element={<SchedulePage />} />
          <Route path="/admin/servicos" element={<PortfolioPage />} />
          
          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* Footer Simples */}
      <footer style={{ 
        padding: '1.5rem', 
        textAlign: 'center', 
        borderTop: '1px solid var(--border)',
        color: 'var(--text-secondary)',
        fontSize: '0.875rem'
      }}>
        &copy; 2026 Central do Corte - Sistema de Agendamento Premium
      </footer>
    </Router>
  )
}

export default App
