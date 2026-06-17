# Documento de Planejamento — Central do Corte (`plan.md`)

Este documento delineia o plano de execução para o desenvolvimento da **Central do Corte**, garantindo que a arquitetura em React atenda aos requisitos operacionais, visuais e técnicos estabelecidos.

---

## 1. Visão Geral e Objetivos do Projeto
A Central do Corte tem como objetivo primário modernizar a gestão de atendimento em barbearias de alto fluxo por meio de agendamentos automatizados e em tempo real. A plataforma resolve o problema de filas presenciais exaustivas, métodos manuais (cadernos/mensagens) e ociosidade na agenda. 

O sistema atenderá a dois perfis:
* **Cliente:** Foco em conveniência, permitindo cadastro, visualização de horários e agendamento autônomo sem intervenção humana.
* **Administrador (Barbeiro):** Foco em agilidade, utilizando um painel de controle otimizado para gerenciar a rotina, cancelar/reagendar horários e editar o portfólio de serviços.

---

## 2. Decisões Arquiteturais e Stack Técnico
Para suportar as demandas de assincronicidade e interface reativa propostas, a fundação técnica do projeto seguirá estas diretrizes:

* **Framework Frontend:** React.js.
* **Gerenciamento de Estado Global:** A arquitetura utilizará o **Zustand** para criar uma *store* centralizada. Isso facilitará o controle do carrinho de agendamento no fluxo *Split Screen* e o gerenciamento de permissões do painel administrativo, substituindo estados locais complexos e eliminando a necessidade de passagem manual de propriedades (*props*) pela árvore de componentes.
* **Sincronização em Tempo Real:** Implementação de *WebSockets* ou *Polling* para garantir que a agenda e a disponibilidade de horários sejam atualizadas instantaneamente em ambas as pontas (Cliente e Barbeiro), sem a necessidade de atualizar a página (F5).
* **Estilização:** CSS/Styled Components ou Tailwind focado em um *Dark Mode* obrigatório para todo o sistema.

---

## 3. Fases de Desenvolvimento (Roadmap)

| Fase | Descrição | Componentes Críticos |
| :--- | :--- | :--- |
| **Fase 1: Setup e Infraestrutura** | Configuração do ambiente, rotas base e identidade visual. | Temas de cores (Cinza Chumbo/Dourado), *store* do Zustand, roteamento (Cliente vs. Admin). |
| **Fase 2: Portal do Cliente** | Desenvolvimento da *Landing Page* e do fluxo de conversão. | *Hero Section*, vitrine de portfólio, *Split Screen* (40/60) e *Sticky Footer*. |
| **Fase 3: Dashboard Admin** | Criação do painel de gestão do barbeiro focado em desktop. | *Sidebar* (20%), métricas diárias, visualização em *Timeline* (blocos de 30-40 min). |
| **Fase 4: Ações e Edições** | Implementação de fluxos de edição e interações de estado. | *Offcanvas* para remarcação, *Modal* de edição de serviços e tabelas de portfólio. |
| **Fase 5: UX e Refinamento** | Prevenção de erros e notificações assíncronas. | *Toast Notifications* verdes, *Prompts* secundários para ações destrutivas, transições de *Hover*. |

---

## 4. UI/UX e Padrões de Interface

O design foca no conforto visual do barbeiro e em um aspecto *premium*. 

* **Paleta de Cores Estrita:**
    * **Fundo:** Cinza Escuro (`#121212` a `#1A1A1A`).
    * **Superfícies (Modais/Cards):** Cinza Chumbo (`#2A2A2A`).
    * **Cor de Ação (Botões Principais):** Dourado/Cobre (`#D4AF37` ou `#E5A93B`).
    * **Status de Feedback:** Verde (`#4CAF50`) para sucesso/disponível; Vermelho (`#F44336`) para erro/ocupado.
* **Tipografia:** *Oswald* ou *Montserrat* para cabeçalhos (Headings); *Roboto* ou *Inter* para os textos de apoio e botões.

### Estrutura de Telas
* **Layout de Agendamento (Cliente):** Implementar o padrão *Split Screen* em desktops. A esquerda (40%) exibirá a lista de serviços (com borda dourada ativa na seleção), enquanto a direita (60%) renderizará o calendário dinâmico. A confirmação deve ficar isolada em um *Sticky Footer*.
* **Layout do Dashboard (Admin):** Utilizar uma *Sidebar* de navegação fixada à esquerda (20%) e a área principal (80%) dedicada ao trabalho diário. A agenda será renderizada no formato *Timeline* entre 08h e 20h.

---

## 5. Regras de Negócio e Comportamentos Restritos
* **Atualização Silenciosa:** Todo feedback positivo (ex: salvamento de preços, confirmação de horários) deve disparar um *Toast* no canto superior direito, sem recarregar o layout atual.
* **Restrição de Interações Críticas:** Ações irreversíveis ou sensíveis, como o cancelamento de um agendamento no *Offcanvas* ou a exclusão de um serviço no *Modal* do portfólio, exigem obrigatoriamente uma etapa extra de confirmação (Prompt) do usuário.
* **Disponibilidade Condicional:** Quando um barbeiro cancela um horário agendado, essa lacuna na *Timeline* deve voltar a ficar cinza claro e ser imediatamente liberada para os clientes agendarem.