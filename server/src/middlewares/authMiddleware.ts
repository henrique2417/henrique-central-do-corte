import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'central_do_corte_super_secret_key_2026';

export interface TokenPayload {
  id: string;
  email: string;
  role: 'CLIENTE' | 'ADMIN';
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware para garantir que o usuário está autenticado via JWT.
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: 'Acesso negado. Token de autenticação não fornecido.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token de autenticação inválido ou expirado.' });
    return;
  }
}

/**
 * Middleware para garantir que o usuário autenticado é um ADMINISTRADOR.
 * Deve ser usado em conjunto/após o authenticateToken.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Acesso negado. Usuário não autenticado.' });
    return;
  }

  if (req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Acesso proibido. Apenas administradores podem realizar esta ação.' });
    return;
  }

  next();
}
