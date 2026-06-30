import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

/**
 * POST /api/appointments
 * Cria um novo agendamento de cliente. (Apenas Autenticado)
 */
export async function createAppointment(req: Request, res: Response): Promise<void> {
  try {
    const { serviceId, date, time } = req.body;
    const userId = req.user?.id; // Autenticado via authenticateToken

    if (!userId) {
      res.status(401).json({ error: 'Acesso negado. Usuário não autenticado.' });
      return;
    }

    if (!serviceId) {
      res.status(400).json({ error: 'O ID do serviço é obrigatório.' });
      return;
    }

    if (!date || !time) {
      res.status(400).json({ error: 'A data e o horário são obrigatórios.' });
      return;
    }

    // Verificar se o serviço existe
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      res.status(404).json({ error: 'Serviço não encontrado.' });
      return;
    }

    // Combinar data e hora (ex: date "2026-06-29" e time "09:30")
    // Formato ISO esperado: YYYY-MM-DDTHH:mm:ss.sssZ
    const dataHoraString = `${date}T${time}:00`;
    const data_hora = new Date(dataHoraString);

    if (isNaN(data_hora.getTime())) {
      res.status(400).json({ error: 'Formato de data ou hora inválido.' });
      return;
    }

    // Verificar se já existe um agendamento ativo para este mesmo horário
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        data_hora,
        status: {
          in: ['CONFIRMADO', 'PENDENTE'],
        },
      },
    });

    if (existingAppointment) {
      res.status(400).json({ error: 'Este horário já está ocupado por outro agendamento.' });
      return;
    }

    // Criar o agendamento no banco de dados
    const appointment = await prisma.appointment.create({
      data: {
        userId,
        serviceId,
        data_hora,
        status: 'CONFIRMADO', // Define como confirmado para fluxo direto
      },
      include: {
        user: true,
        service: true,
      },
    });

    res.status(201).json({
      message: 'Agendamento realizado com sucesso!',
      appointment,
    });
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    res.status(500).json({ error: 'Erro interno ao realizar agendamento.' });
  }
}

/**
 * GET /api/appointments/daily
 * Retorna os agendamentos do dia atual formatados para a Timeline do Admin. (Apenas ADMIN)
 */
export async function getDailyAppointments(req: Request, res: Response): Promise<void> {
  try {
    const now = new Date();
    
    // Obtém a data de hoje no fuso horário do Brasil formatada como YYYY-MM-DD
    const formatterDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const todayStr = formatterDate.format(now);

    // Define início e fim do dia no fuso horário brasileiro para consulta no DB
    const startOfToday = new Date(`${todayStr}T00:00:00`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999`);

    const appointments = await prisma.appointment.findMany({
      where: {
        data_hora: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
      include: {
        user: true,
        service: true,
      },
      orderBy: {
        data_hora: 'asc',
      },
    });

    // Formata o retorno para bater exatamente com a interface Appointment do frontend
    const formattedAppointments = appointments.map((app) => {
      // Extrai o horário formatado como HH:MM no fuso de São Paulo
      const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Sao_Paulo',
      });
      const time = timeFormatter.format(app.data_hora);

      return {
        id: app.id,
        time,
        clientName: app.user.name,
        service: app.service.titulo,
        price: app.service.preco,
        status: app.status as 'CONFIRMADO' | 'PENDENTE' | 'CANCELADO',
      };
    });

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos diários:', error);
    res.status(500).json({ error: 'Erro interno ao buscar agendamentos diários.' });
  }
}
