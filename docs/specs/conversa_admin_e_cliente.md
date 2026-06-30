# Especificação Funcional e Técnica: Integração de Agendamentos (Back-end) — Central do Corte

## 1. Visão Geral
Este documento detalha a implementação do módulo de **Agendamentos (Appointments)** no Back-end. O objetivo desta etapa foi construir a infraestrutura de dados necessária para conectar o fluxo de reservas do Cliente (Front-end) com a visualização operacional da `AgendaTimeline` do Administrador, eliminando os dados falsos (*mocks*) e o erro de rota inexistente (HTTP 404).

---

## 2. Modelagem de Dados (Prisma ORM)

O banco de dados foi expandido para suportar a lógica transacional da barbearia. O novo modelo `Appointment` atua como uma tabela de junção com dados e estados dinâmicos.

### 2.1. Estrutura do Modelo (`schema.prisma`)
O esquema foi atualizado para criar relações diretas entre quem recebe o corte (Usuário) e o que foi comprado (Serviço).

```prisma
enum AppointmentStatus {
  PENDENTE
  CONFIRMADO
  CANCELADO
}

model Appointment {
  id          String            @id @default(uuid())
  data_hora   DateTime
  status      AppointmentStatus @default(PENDENTE)
  
  // Chaves Estrangeiras (Relações)
  userId      String
  user        User              @relation(fields: [userId], references: [id])
  
  serviceId   String
  service     Service           @relation(fields: [serviceId], references: [id])

  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@map("appointments")
}
Nota: É necessário garantir que as tabelas User e Service possuam a relação inversa (ex: appointments Appointment[]) declarada em seus respectivos models.

3. Endpoints da API (Express)
Foi criado o controlador appointmentController.ts e o roteador appointmentRoutes.ts, registrados no app.ts sob o caminho base /api/appointments.

3.1. Criação de Agendamento (POST /api/appointments)
Rota consumida pelo fluxo do Cliente ao finalizar o agendamento no Sticky Footer.

Payload Esperado (Body):

userId (String): ID do cliente logado.

serviceId (String): ID do serviço selecionado.

data_hora (String - ISO 8601): Data e hora escolhidas no calendário.

Comportamento: Valida a integridade dos IDs, cria o registro no banco com o status inicial PENDENTE (ou CONFIRMADO, dependendo da regra de negócio ativa) e retorna os dados recém-criados.

3.2. Leitura da Agenda Diária (GET /api/appointments/daily)
Rota protegida consumida pelo Administrador para popular a <AgendaTimeline />.

Segurança: Requer validação do Token JWT e privilégios de Administrador.

Comportamento: 1. Busca no Prisma todos os agendamentos cuja data_hora corresponda ao dia atual.
2. Inclui os dados relacionados das tabelas estrangeiras (include: { user: true, service: true }).

Transformação de Dados (Data Mapping): Como o Front-end espera um formato específico para renderizar os cartões, o controlador formata a resposta antes de enviar ao cliente, extraindo apenas a hora e os nomes:

JSON
[
  {
    "id": "uuid-do-agendamento",
    "time": "09:00", 
    "clientName": "João Silva",
    "service": "Corte Degradê",
    "price": 45.00,
    "status": "CONFIRMADO"
  }
]
4. Resolução de Conflitos e Integração de Interface
A implementação deste módulo sanou a desconexão estrutural da Fase 3:

O Erro 404 (Not Found): Eliminado após o registro da rota /daily no servidor Express.

Hidratação da Timeline: A AgendaTimeline.tsx foi atualizada para remover o mock local de dados e acionar um useEffect na montagem, buscando os agendamentos reais desta nova API e inserindo-os nos blocos exatos da linha do tempo graças à conversão do campo time.