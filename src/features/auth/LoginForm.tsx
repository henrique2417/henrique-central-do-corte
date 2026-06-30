import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useScheduleStore } from '../../stores/useScheduleStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import './AuthForm.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSuccess }) => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useScheduleStore((state) => state.addToast);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas no Client-side
    if (!email.trim() || !password) {
      addToast('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    if (password.length < 6) {
      addToast('A senha deve possuir pelo menos 6 caracteres.', 'error');
      return;
    }

    const success = await login(email, password);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card padding="lg" className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Entre na sua Conta</h2>
        <p className="auth-subtitle">Acesse seus agendamentos e o painel premium</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="Sua senha secreta"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="current-password"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="auth-btn"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="auth-footer">
        <p>
          Não tem uma conta?{' '}
          <button
            type="button"
            className="auth-link-btn"
            onClick={onSwitchToRegister}
            disabled={isLoading}
          >
            Cadastre-se aqui
          </button>
        </p>
      </div>
    </Card>
  );
};
