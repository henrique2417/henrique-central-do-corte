import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * GET /api/services
 * Retorna a lista de todos os serviços cadastrados.
 * Utilizado tanto na landing page quanto no painel administrativo.
 */
export async function getServices(req: Request, res: Response): Promise<void> {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        titulo: 'asc',
      },
    });

    res.status(200).json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ error: 'Erro interno ao buscar o portfólio de serviços.' });
  }
}

/**
 * POST /api/services
 * Cria um novo serviço no portfólio. (Apenas ADMIN)
 */
export async function createService(req: Request, res: Response): Promise<void> {
  try {
    const { titulo, descricao, duracao_minutos, preco, status } = req.body;

    // Validações básicas
    if (!titulo || typeof titulo !== 'string' || titulo.trim().length < 3) {
      res.status(400).json({ error: 'Título inválido. Mínimo de 3 caracteres.' });
      return;
    }

    if (!duracao_minutos || typeof duracao_minutos !== 'number' || duracao_minutos <= 0) {
      res.status(400).json({ error: 'Duração deve ser um número positivo em minutos.' });
      return;
    }

    if (preco === undefined || typeof preco !== 'number' || preco < 0) {
      res.status(400).json({ error: 'Preço deve ser um número válido (maior ou igual a zero).' });
      return;
    }

    const service = await prisma.service.create({
      data: {
        titulo: titulo.trim(),
        descricao: descricao ? descricao.trim() : null,
        duracao_minutos,
        preco,
        status: status || 'ATIVO',
      },
    });

    res.status(201).json({
      message: 'Serviço criado com sucesso!',
      service,
    });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ error: 'Erro interno ao criar o serviço.' });
  }
}

/**
 * PUT /api/services/:id
 * Atualiza os dados de um serviço existente. (Apenas ADMIN)
 */
export async function updateService(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { titulo, descricao, duracao_minutos, preco, status } = req.body;

    // Verificar se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    // Atualização
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        titulo: titulo ? titulo.trim() : undefined,
        descricao: descricao !== undefined ? (descricao ? descricao.trim() : null) : undefined,
        duracao_minutos: typeof duracao_minutos === 'number' ? duracao_minutos : undefined,
        preco: typeof preco === 'number' ? preco : undefined,
        status: status || undefined,
      },
    });

    res.status(200).json({
      message: 'Serviço atualizado com sucesso!',
      service: updatedService,
    });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar o serviço.' });
  }
}

/**
 * DELETE /api/services/:id
 * Remove permanentemente um serviço do banco de dados. (Apenas ADMIN)
 */
export async function deleteService(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Verificar se o serviço existe
    const existingService = await prisma.service.findUnique({
      where: { id },
    });

    if (!existingService) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    await prisma.service.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Serviço removido com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ error: 'Erro interno ao remover o serviço.' });
  }
}
