import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'central_do_corte_super_secret_key_2026';

/**
 * Auxiliar para validar o formato de e-mail.
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/auth/register
 * Cadastra um novo usuário (Cliente ou Admin/Barbeiro)
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role } = req.body;

    // 1. Validação de campos obrigatórios
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ error: 'Nome inválido. Deve ter pelo menos 2 caracteres.' });
      return;
    }

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      res.status(400).json({ error: 'E-mail inválido.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ error: 'A senha deve conter no mínimo 6 caracteres.' });
      return;
    }

    // 2. Validação do perfil (Role)
    let userRole: 'CLIENTE' | 'ADMIN' = 'CLIENTE';
    if (role) {
      const upperRole = String(role).toUpperCase();
      if (upperRole === 'ADMIN' || upperRole === 'BARBEIRO') {
        userRole = 'ADMIN';
      } else if (upperRole === 'CLIENTE') {
        userRole = 'CLIENTE';
      } else {
        res.status(400).json({ error: 'Perfil inválido. Use CLIENTE ou ADMIN.' });
        return;
      }
    }

    // 3. Verificar se o e-mail já está cadastrado
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      res.status(409).json({ error: 'E-mail já cadastrado no sistema.' });
      return;
    }

    // 4. Hashing da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Salvar usuário no banco de dados
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: userRole,
      },
    });

    // 6. Geração do Token JWT para login automático após o cadastro
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expira em 7 dias
    );

    // Retorna os dados do usuário (exceto senha) e o token de autenticação
    res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Erro no registro do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao registrar usuário.' });
  }
}

/**
 * POST /api/auth/login
 * Autentica o usuário e gera o token JWT
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    // 1. Validação simples de campos
    if (!email || !password) {
      res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
      return;
    }

    // 2. Localizar usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase().trim() },
    });

    if (!user) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    // 3. Comparar as senhas
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciais inválidas.' });
      return;
    }

    // 4. Geração do Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retorna os dados públicos do usuário e o token
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Erro no login do usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor ao realizar login.' });
  }
}
