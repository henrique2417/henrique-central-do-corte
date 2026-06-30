import { Router } from 'express';
import { 
  getServices, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController';
import { authenticateToken, requireAdmin } from '../middlewares/authMiddleware';

const router = Router();

// GET /api/services (Público: para listar na Landing Page do cliente)
router.get('/', getServices);

// POST /api/services (Protegido: apenas para ADMIN)
router.post('/', authenticateToken, requireAdmin, createService);

// PUT /api/services/:id (Protegido: apenas para ADMIN)
router.put('/:id', authenticateToken, requireAdmin, updateService);

// DELETE /api/services/:id (Protegido: apenas para ADMIN)
router.delete('/:id', authenticateToken, requireAdmin, deleteService);

export default router;
