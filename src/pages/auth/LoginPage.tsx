import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoginForm } from '../../features/auth/LoginForm';
import { RegisterForm } from '../../features/auth/RegisterForm';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Redirecionamento automático caso o usuário já esteja autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/agenda');
      } else {
        navigate('/agendar');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleAuthSuccess = () => {
    // Redirecionamento após o sucesso é tratado pelo useEffect acima de forma reativa
  };

  return (
    <div className="login-page-container">
      <div className="login-logo-container">
        <h1 className="login-logo">
          CENTRAL DO <span className="logo-accent">CORTE</span>
        </h1>
        <p className="login-tagline">Sua barbearia preferida, agendada de forma premium e sem filas.</p>
      </div>

      <div className="login-form-wrapper">
        {isLoginMode ? (
          <LoginForm
            onSwitchToRegister={() => setIsLoginMode(false)}
            onSuccess={handleAuthSuccess}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={() => setIsLoginMode(true)}
            onSuccess={handleAuthSuccess}
          />
        )}
      </div>

      {isAuthenticated && (
        <div className="logged-in-debug">
          <p>
            Logado como: <strong>{user?.name}</strong> ({user?.role})
          </p>
          <button onClick={logout} className="debug-logout-btn">
            Sair da Conta (Logout)
          </button>
        </div>
      )}
    </div>
  );
}
