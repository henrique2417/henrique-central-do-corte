# Especificação Funcional e Técnica: Dashboard Admin — Central do Corte (`Spec.md`)

## 1. Visão Geral
Este documento detalha a implementação da **Fase 3 (Dashboard Admin)** da plataforma Central do Corte. 
O objetivo desta fase foi construir o painel de gestão exclusivo para os administradores (barbeiros), garantindo uma interface otimizada para telas largas (desktops), navegação ágil e visualização clara da demanda diária através de uma arquitetura de *Split Screen* adaptada (20/80).

---

## 2. Arquitetura de Front-end (React & Componentes)

O ambiente administrativo foi isolado do portal do cliente através de um layout próprio, focado em produtividade e leitura rápida.

### 2.1. Layout Estrutural (`AdminLayout.tsx`)
O componente `AdminLayout` atua como o *wrapper* (contêiner base) para todas as páginas protegidas do painel.
* **Proporção da Tela:** Implementa uma divisão estrita: 20% da largura (ou mínimo de 260px) é dedicada à barra lateral fixa (Sidebar), enquanto os 80% restantes formam a área de trabalho (Workspace) com rolagem independente.
* **Navegação (Sidebar):** * Contém o logotipo da "Central do Corte" em destaque com texto em gradiente dourado.
  * Renderiza dinamicamente os links de navegação (`Agenda do Dia`, `Portfólio de Serviços`).
  * O link ativo é identificado automaticamente via `react-router-dom` (`useLocation`), recebendo um fundo sutil e uma borda esquerda Dourada/Cobre (`#D4AF37`) para orientar o usuário.
* **Rodapé da Sidebar:** Exibe as informações do usuário logado consumidas diretamente do estado global do Zustand (`useAuthStore`), incluindo um avatar gerado a partir da inicial do nome, além do botão global de "Sair" (Logout).
* **Responsividade:** Em telas menores (tablets/mobile), o layout abandona a divisão 20/80 e adota uma estrutura em coluna, transformando a barra lateral em um menu de navegação horizontal superior para preservar espaço útil.

### 2.2. Cabeçalho e Métricas (`DashboardHeader.tsx`)
Posicionado no topo da área de trabalho, este componente consolida as informações vitais do dia de trabalho.
* **Saudação e Data:** Exibe o nome do administrador e a data atual formatada por extenso, processada por funções utilitárias (`utils/date.ts`).
* **Botão de Ação Rápida:** Apresenta o CTA primário `+ Novo Agendamento` para eventuais *walk-ins* (clientes que chegam sem horário marcado).
* **Grid de Métricas Rápidas:** Uma grade de três cartões interativos que exibem o resumo operacional:
  1. *Total de Cortes Hoje* (Destaque em Dourado).
  2. *Previsão de Receita* (Destaque em Verde/Sucesso).
  3. *Taxa de Ocupação* (Destaque em Laranja/Aviso).
  * *Nota de Implementação:* Os dados de métricas encontram-se temporariamente "mockados" (simulados) no Front-end para estruturação visual, aguardando integração com o banco de dados.

### 2.3. O Coração da Agenda (`AgendaTimeline.tsx`)
O componente de gestão diária é renderizado no formato de linha do tempo (*Timeline*), substituindo os calendários tradicionais por uma visão contínua do turno de trabalho.
* **Geração de Horários:** Utiliza o utilitário `generateTimeSlots(30)` para criar blocos contínuos a cada 30 minutos, cobrindo a janela operacional das 08:00 às 20:00.
* **Renderização Condicional de Blocos:**
  * **Horários Vazios (`empty-slot`):** Rendem um bloco pontilhado transparente indicando "Disponível".Ao passar o mouse (*hover*), revela o ícone de adição (`+`), convidando o barbeiro a alocar um cliente manualmente.
  * **Horários Ocupados (`appointment-card`):** Rendem um *Card* elevado (sombra e bordas ativas) contendo as informações críticas do agendamento.
* **Anatomia do Card de Agendamento:** * Possui uma borda esquerda colorida (`status-border`) sinalizando se está confirmado (Verde).
  * Exibe o nome do cliente em negrito, o valor formatado à direita (`R$ XX.XX`) e o nome do serviço abaixo.
  * Contém um botão lateral interativo de "Ação/Edição", destinado a acionar o *Offcanvas* para remarcar ou cancelar o horário.

---

## 3. Padrões de Design e UI/UX (Look & Feel)
A fase consolidou a identidade premium da barbearia através das folhas de estilo e propriedades CSS (Custom Properties):
* **Tema Obrigatório (Dark Mode):** Aplicação estrita de `var(--bg-main)` para o fundo total (`#121212`) e `var(--surface)` para a elevação de Cards e da Sidebar (`#2A2A2A` e `#1A1A1A`).
* **Cores de Estado e Hierarquia:** O uso do Dourado/Cobre (`var(--accent)`) está reservado para apontar interatividade (links ativos, hover nos botões e ícones principais). As métricas utilizam verde para ganhos (`var(--status-success)`).
* **Acessibilidade de Interação:** Todos os blocos interativos (vazios e preenchidos da Timeline) e botões de ação possuem propriedades de `transition: all var(--transition-fast)` garantindo suavidade. O botão de "Sair" muda sua borda para vermelho claro no momento do *hover*, prevenindo cliques indesejados e confirmando a ação destrutiva.

---

## 4. Integração Back-end (Estado Atual e Próximos Passos)
Durante esta fase, o foco arquitetural residiu em preparar o Front-end para receber um grande fluxo de dados através do componente `<AgendaTimeline />`. O Back-end já suporta autenticação (Role: ADMIN) e controle de serviços (CRUD), sendo a ponte para as métricas o próximo passo.

### Requisitos Mapeados para o Back-end (Próxima Integração)
A estrutura front-end montada nesta fase exigirá as seguintes implementações na API para tornar a Timeline dinâmica:
1. **Modelagem de Agendamentos (`Appointment`):** O Prisma precisará de um modelo que relacione `User` (Cliente), `Service` e contemple campos de `data_hora` e `status` (PENDENTE, CONFIRMADO, CANCELADO).
2. **Endpoint de Gestão (`GET /api/appointments/daily`):** A rota de agenda precisará retornar apenas os cortes de um dia específico (por padrão, o dia atual `todayStr`) para popular os *slots* ocupados da `AgendaTimeline`.
3. **Endpoint de Métricas (`GET /api/appointments/metrics`):** Uma rota focada em consolidação no banco de dados para calcular o "Total de Cortes" e a "Previsão de Receita" via contagem (count) e somatório (sum) de valores no banco.