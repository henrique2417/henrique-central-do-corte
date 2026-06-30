import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from './components/feedback/ToastContainer'
import { useAuthStore } from './stores/authStore'

// Importação das páginas (Esqueletos)
import LandingPage from './pages/client/LandingPage'
import BookingPage from './pages/client/BookingPage'
import SchedulePage from './pages/admin/SchedulePage'
import PortfolioPage from './pages/admin/PortfolioPage'
import LoginPage from './pages/auth/LoginPage'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRole: 'CLIENTE' | 'ADMIN'
}

function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== allowedRole) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/agenda" replace />
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (isAuthenticated) {
    if (user?.role === 'ADMIN') {
      return <Navigate to="/admin/agenda" replace />
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Router>
      <ToastContainer />

      {/* Renderização das Rotas */}
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Fluxo Cliente */}
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
          <Route 
            path="/agendar" 
            element={
              <ProtectedRoute allowedRole="CLIENTE">
                <BookingPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fluxo Admin */}
          <Route 
            path="/admin/agenda" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <SchedulePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/servicos" 
            element={
              <ProtectedRoute allowedRole="ADMIN">
                <PortfolioPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Auth */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            } 
          />
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
