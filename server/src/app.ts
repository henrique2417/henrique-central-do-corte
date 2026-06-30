import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import appointmentRoutes from './routes/appointmentRoutes';

const app = express();

// Middleware de CORS - permite chamadas do frontend
app.use(cors());

// Middleware para parsing de JSON nos payloads das requisições
app.use(express.json());

// Rota de status/healthcheck para monitoramento
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas de Autenticação de acordo com as especificações do PRD
app.use('/api/auth', authRoutes);

// Rotas de Serviços (Portfólio)
app.use('/api/services', serviceRoutes);

// Rotas de Agendamentos (Appointments)
app.use('/api/appointments', appointmentRoutes);

// Middleware de tratamento de erro global (fallback de segurança)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro detectado no servidor:', err);
  res.status(500).json({ error: 'Ocorreu um erro interno inesperado.' });
});

export default app;
