# Especificação Funcional e Técnica: Ações e Edições (Fase 4) — Central do Corte

## 1. Visão Geral
Este documento detalha a implementação da **Fase 4 (Ações e Edições)** da plataforma Central do Corte. O objetivo desta etapa foi dar vida ao painel do administrador, introduzindo interatividade através de componentes sobrepostos (*Modais* e *Offcanvas*). A fase focou na gestão do portfólio de serviços e no controle da agenda diária, garantindo fluxos seguros de edição e exclusão de dados com base nas regras estritas de prevenção de erros de UI/UX.

---

## 2. Arquitetura de Front-end (React & Componentes)

Para manter a tela principal limpa e evitar o carregamento de novas páginas a cada edição, a arquitetura fez uso intensivo de sobreposições visuais com gerenciamento de estado local integrado à *store* global.

### 2.1. Tabela do Portfólio de Serviços (`PortfolioPage.tsx`)
Esta é a tela central de gestão de catálogo do barbeiro, encapsulada pelo `AdminLayout`.
* **Cabeçalho da Página:** Contém o título "Portfólio de Serviços" alinhado à esquerda e a ação primária (botão dourado) `+ Novo Serviço` à direita.
* **Tabela de Dados (Data Table):** Estrutura tabular horizontal contendo as colunas: `Nome do Serviço`, `Descrição`, `Duração Média`, `Preço (R$)`, `Status (Ativo/Inativo)` e `Ações`.
* **Integração com API (Fetch):** Durante a montagem do componente (via `useEffect`), a página consome o endpoint `GET /api/services`. Para garantir a segurança, o token JWT do administrador é resgatado da `authStore` e injetado nos *headers* da requisição (Authorization).
* **Coluna de Ações:** Apresenta o ícone de Lápis (Editar), que ao ser clicado, injeta os dados do serviço selecionado no estado da página e abre o `ServiceModal`.

### 2.2. Modal de Criação e Edição (`ServiceModal.tsx`)
Componente de sobreposição centralizado responsável pelo fluxo de CRUD (Create, Update, Delete) dos serviços.
* **Comportamento Visual:** Abre no centro da tela e aplica um *backdrop* (fundo escurecido/translúcido) que isola e bloqueia a página de fundo.
* **Estrutura do Formulário:** Contém campos de *input* e *select* para: Título, Descrição, Duração (min), Preço e Status.
* **Lógica de Múltiplos Estados (Create vs. Edit):** * Se o modal for aberto via botão "+ Novo Serviço", exibe apenas o botão primário de "Salvar" (Dourado/Cobre).
  * Se o modal for aberto clicando em "Editar" na tabela, injeta os dados existentes nos campos e revela um botão secundário destrutivo "Excluir Serviço" na cor Vermelha (`#F44336`).
* **Prevenção de Erros (Regra Crítica do PRD):** O clique no botão "Excluir Serviço" está bloqueado por um prompt de confirmação obrigatório (*"Tem certeza que deseja excluir este serviço?"*). A exclusão só prossegue mediante a segunda confirmação do usuário.
* **Feedback Imediato:** O sucesso de qualquer operação (salvar ou excluir) engatilha o fechamento automático do modal e dispara um Toast Notification verde informando o sucesso, sem recarregar a página (F5).

### 2.3. Gaveta Lateral de Agendamentos (`AppointmentOffcanvas.tsx`)
Painel interativo conectado à linha do tempo da agenda (`AgendaTimeline.tsx`), projetado para gerenciar imprevistos (cancelamentos e remarcações).
* **Comportamento Visual:** Ao invés de um modal central, este componente atua como uma gaveta lateral (*Offcanvas*) que desliza a partir da borda direita da tela, aplicando também um *backdrop* escuro no resto da interface.
* **Detalhes do Card:** Renderiza de forma destacada e elegante as informações do horário ocupado que foi clicado: Nome do Cliente, Serviço selecionado, Valor a ser pago e o Horário na grade.
* **Ações de Gestão:**
  * **Remarcar:** Botão em estilo *outline* (transparente com bordas) na cor Dourado/Cobre para iniciar o fluxo de alteração de data/hora.
  * **Cancelar Agendamento:** Botão de estilo preenchido na cor Vermelha para exclusão do horário.
* **Prevenção de Erros (Regra Crítica):** Assim como nos serviços, a exclusão de um agendamento exige a passagem por um prompt de segurança (*"Deseja realmente cancelar este horário?"*). Após a confirmação, o painel é recolhido e o *Toast* de sucesso é engatilhado.

---

## 3. Padrões de Design e UI/UX (Look & Feel)
As regras visuais consolidadas no Documento de Design foram aplicadas estritamente em todos os novos componentes:
* **Dark Mode Global:** Fundos do portfólio preservados na cor `#121212`, com a Tabela de Dados, Modais e Offcanvas flutuando sobre a cor de superfície `#2A2A2A` (Cinza Chumbo). Textos legíveis em tons de Branco Gelo e Cinza Claro.
* **Isolamento de Foco:** O uso dos *backdrops* (telas de fundo escurecidas ao redor de modais e painéis laterais) garante que a atenção do barbeiro foque 100% na ação crítica (editar preço ou cancelar agendamento), reduzindo o cansaço visual de interfaces muito carregadas.
* **Cores de Botões e Estado:** Preservação estrita das diretrizes do sistema com as variáveis `--accent` (`#D4AF37`) e `--status-danger` (`#F44336`) guiando as intenções de clique de forma instintiva e segura.

---

## 4. Integração Back-end (Estado Atual e Próximos Passos)
A Fase 4 conectou definitivamente o Front-end de Portfólio com a API de Serviços desenvolvida anteriormente, ativando as engrenagens de dados do sistema.

### Integrações Realizadas (Tabela de Serviços)
* `GET /api/services`: Listagem na tabela.
* `POST /api/services`: Salvar um novo serviço via Modal.
* `PUT /api/services/:id`: Editar dados de um serviço via Modal.
* `DELETE /api/services/:id`: Remover do banco de dados (protegido pela dupla confirmação).

### Requisitos Mapeados para Próximas Etapas (Offcanvas da Agenda)
A interface do *Offcanvas* já está pronta para receber as chamadas de alteração de agendamentos. Assim que as rotas de *Appointments* estiverem prontas no backend, os botões do painel lateral deverão ser plugados aos seguintes endpoints:
1. `PUT /api/appointments/:id` (ou `PATCH`): Para alterar a data/hora ou modificar o `status` para `CANCELADO`.
2. Após sucesso, engatilhará uma re-busca inteligente na store (`useScheduleStore`) ou emitirá um evento WebSocket para redesenhar a `AgendaTimeline` automaticamente e liberar o horário vazio.