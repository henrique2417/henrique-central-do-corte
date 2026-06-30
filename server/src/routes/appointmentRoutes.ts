import { Router } from 'express';
import { 
  createAppointment, 
  getDailyAppointments 
} from '../controllers/appointmentController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/appointments (Protegido: para qualquer cliente autenticado criar seu agendamento)
router.post('/', authenticateToken, createAppointment);

// GET /api/appointments/daily (Protegido: apenas para ADMIN buscar agendamentos do dia atual)
router.get('/daily', authenticateToken, requireAdmin, getDailyAppointments);

export default router;
