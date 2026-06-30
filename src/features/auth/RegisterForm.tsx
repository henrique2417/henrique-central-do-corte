import React, { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useScheduleStore } from '../../stores/useScheduleStore';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import './AuthForm.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const register = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addToast = useScheduleStore((state) => state.addToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'CLIENTE' | 'ADMIN'>('CLIENTE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas no Client-side
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      addToast('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    if (name.trim().length < 2) {
      addToast('O nome deve possuir pelo menos 2 caracteres.', 'error');
      return;
    }

    if (password.length < 6) {
      addToast('A senha deve conter no mínimo 6 caracteres.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      addToast('As senhas digitadas não coincidem.', 'error');
      return;
    }

    const success = await register(name, email, password, role);
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <Card padding="lg" className="auth-card">
      <div className="auth-header">
        <h2 className="auth-title">Crie sua Conta</h2>
        <p className="auth-subtitle">Cadastre-se na Central do Corte premium</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="register-name">Nome Completo</label>
          <input
            id="register-name"
            type="text"
            placeholder="Digite seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">E-mail</label>
          <input
            id="register-email"
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
          <label htmlFor="register-password">Senha</label>
          <input
            id="register-password"
            type="password"
            placeholder="Mínimo de 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">Confirmar Senha</label>
          <input
            id="register-confirm-password"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-role">Perfil do Usuário</label>
          <select
            id="register-role"
            value={role}
            onChange={(e) => setRole(e.target.value as 'CLIENTE' | 'ADMIN')}
            disabled={isLoading}
            className="auth-select"
          >
            <option value="CLIENTE">Cliente (Agendamentos)</option>
            <option value="ADMIN">Administrador / Barbeiro (Gestão)</option>
          </select>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isLoading}
          className="auth-btn"
        >
          {isLoading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>

      <div className="auth-footer">
        <p>
          Já possui uma conta?{' '}
          <button
            type="button"
            className="auth-link-btn"
            onClick={onSwitchToLogin}
            disabled={isLoading}
          >
            Faça login aqui
          </button>
        </p>
      </div>
    </Card>
  );
};
