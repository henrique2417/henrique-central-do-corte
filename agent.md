

## 1. Visão Geral do Projeto
* **Identidade do Produto:** Central do Corte.
* **Problema Resolvido:** Eliminar filas de espera presenciais, substituir cadernos físicos/mensagens manuais e mitigar a ociosidade ou superlotação em barbearias de alto fluxo.
* **Objetivo do Sistema:** Modernizar a gestão de atendimento através de agendamentos automatizados e em tempo real, melhorando a eficiência do profissional e a experiência do cliente.

---

## 2. Personas e Fluxos de Usuário
O desenvolvimento deve sempre considerar duas pontas isoladas:

* **Cliente (Foco em Conversão e Conveniência):**
    * Deve poder se cadastrar e consultar a disponibilidade da barbearia de forma autônoma.
    * O fluxo de agendamento não deve exigir intervenção humana.
    * **Jornada de Agendamento:** Login/Cadastro -> Visualiza serviços/preços -> Consulta calendário em tempo real -> Seleciona horário -> Confirma.
* **Administrador / Barbeiro (Foco em Agilidade e Dashboard):**
    * Precisa de ferramentas visuais em telas largas (monitores de balcão) para gerenciar a rotina sem pausar o trabalho.
    * Deve conseguir visualizar a demanda, cancelar/reagendar horários e editar preços e tipos de serviços no portfólio.
    * **Jornada de Gestão:** Acessa painel -> Visualiza Timeline -> Gerencia imprevistos (reagendamento) -> Horários cancelados voltam a ficar disponíveis para o público imediatamente.

---

## 3. Identidade Visual e UI/UX (Look & Feel)
As regras de CSS e estilização devem seguir estritamente o padrão premium focado no conforto visual do barbeiro:

* **Tema Obrigatório:** *Dark Mode*.
* **Paleta de Cores:**
    * **Background:** Cinza Escuro (`#121212` a `#1A1A1A`).
    * **Superfícies (Cards/Modais):** Cinza Chumbo (`#2A2A2A`).
    * **Ações Primárias (Accent):** Dourado/Cobre (`#D4AF37` ou `#E5A93B`) — *Usar em botões críticos como "Agendar" e "Confirmar"*.
    * **Tipografia (Textos):** Branco Gelo (`#F5F5F5`) para títulos e Cinza Claro (`#B0B0B0`) para apoio.
    * **Status:** Verde (`#4CAF50`) para sucesso/disponível e Vermelho (`#F44336`) para erro/cancelamento/ocupado.
* **Fontes:** *Oswald* ou *Montserrat* para Títulos (Headings) e *Roboto* ou *Inter* para Botões e Corpo de texto.

---

## 4. Arquitetura de Telas e Componentes

### Ambiente do Cliente
* **Landing Page:** Deve contar com cabeçalho fixo, *Hero Section* com imagem de fundo coberta por máscara escura, CTA principal dourado e Grid de serviços detalhando tempo e preço.
* **Fluxo de Agendamento:**
    * Deve utilizar padrão *Split Screen* (Tela dividida) no Desktop para evitar carregamentos lentos.
    * **Esquerda (40%):** Seleção de serviço (com borda dourada ao ativar).
    * **Direita (60%):** Calendário e grade de horários (ocultando/desabilitando indisponíveis).
    * **Ação Final:** Utilizar *Sticky Footer* (Rodapé fixo) com resumo do pedido e botão de confirmação.

### Ambiente do Administrador (Dashboard)
* **Layout Base:** *Sidebar* de 20% à esquerda (navegação) e Área de Trabalho de 80% à direita (com saudação e botão rápido de novo agendamento).
* **Agenda do Dia:**
    * Topo com 3 *Cards* de métricas: Total de Cortes, Previsão de Receita e Taxa de Ocupação.
    * Renderizar visualização em *Timeline* (das 08h às 20h, blocos de 30-40 min).
    * Ações de edição nos cartões da Timeline devem abrir um painel lateral direito (*Offcanvas*) contendo as opções de remarcar ou cancelar.
* **Portfólio de Serviços:** Exibir em formato de tabela horizontal; a edição deve ocorrer via *Modal* sobreposto para atualização rápida de Título, Preço e Tempo.

---

## 5. Regras de Comportamento e Integração Técnica
Ao desenvolver as funcionalidades, atente-se aos seguintes padrões de comportamento exigidos:

* **Assincronicidade e Real-Time:** A agenda do barbeiro e a disponibilidade para o cliente devem se atualizar instantaneamente via *WebSockets* ou *Polling* (sem exigir "F5" ou refresh da página).
* **Feedback Imediato:** Qualquer ação de sucesso (atualização de preço, agendamento, cancelamento) deve disparar *Toast Notifications* verdes no canto superior direito, mantendo o usuário na mesma tela.
* **Prevenção de Falhas Críticas:** Ações destrutivas (ex: exclusão de serviço ou cancelamento de horário) devem obrigatoriamente acionar um prompt secundário de confirmação.
* **Acessibilidade de Navegação:** Elementos interativos no desktop (especialmente destrutivos) devem possuir estados de *Hover* altamente visíveis e mudanças claras de cor para guiar o cursor.