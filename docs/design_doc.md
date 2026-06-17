# Documento de Design de Interface (UI/UX) — Central do Corte

## 1. Identidade Visual e Look & Feel
O design utilizará o padrão predominante de barbearias de médio e alto padrão, que geralmente apostam no **Dark Mode (Modo Escuro)**, pois cansa menos a vista do barbeiro que olhará para a tela o dia todo e passa uma imagem premium para o cliente.

* **Cores Principais:**
    * **Fundo (Background):** Cinza Escuro (`#121212` a `#1A1A1A`) para a tela geral.
    * **Superfícies (Cards/Painéis):** Cinza Chumbo (`#2A2A2A`) para destacar elementos do fundo.
    * **Cor de Ação (Primary/Accent):** Dourado/Cobre (`#D4AF37` ou `#E5A93B`). Usado para botões primários ("Agendar", "Confirmar") e links ativos.
    * **Textos:** Branco Gelo (`#F5F5F5`) para títulos e Cinza Claro (`#B0B0B0`) para textos secundários.
    * **Status:** Verde (`#4CAF50`) para horários confirmados/disponíveis e Vermelho (`#F44336`) para cancelamentos/ocupados.
* **Tipografia:**
    * **Títulos (Headings):** Fonte robusta e geométrica (ex: *Oswald* ou *Montserrat*).
    * **Corpo de Texto e Botões:** Fonte limpa e legível (ex: *Roboto* ou *Inter*).

---

## 2. Arquitetura de Telas (Visão Cliente)
A arquitetura desktop para o cliente segue um modelo tradicional de portal web, focando em navegação por cliques e leitura em "F" (esquerda para direita, cima para baixo).

### Tela 1: Landing Page (Vitrine)
* **Header (Cabeçalho Fixo):**
    * Esquerda: Logo "Central do Corte".
    * Centro: Links de âncora (Serviços, Sobre, Contato).
    * Direita: Botões "Entrar" (Login) e um botão em destaque "Agende seu Corte" (Dourado).
* **Hero Section (Destaque Principal):**
    * Imagem de fundo de alta qualidade ocupando toda a largura, com uma sobreposição escura.
    * Texto centralizado: *"Seu tempo é valioso. Agende seu corte sem filas."*
    * Botão Call-to-Action (CTA) grande para iniciar o fluxo.
* **Sessão de Serviços (Portfólio):**
    * Grid com 3 a 4 colunas exibindo Cards. Cada Card contém: Imagem/Ícone do serviço (ex: Cabelo + Barba), Descrição, Duração (ex: 45 min) e Preço.

### Tela 2: Portal do Cliente Logado (Fluxo de Agendamento)
Otimizado para a largura do desktop, dividindo a tela em duas grandes colunas para evitar mudança de página e carregamentos lentos.

* **Layout em Tela Dividida (Split Screen):**
    * **Coluna Esquerda (40% da tela) - Seleção de Serviço:**
        * Lista limpa de serviços disponíveis com Radio Buttons ou seleção visual.
        * Ao clicar, a borda do serviço selecionado fica Dourada.
    * **Coluna Direita (60% da tela) - Data e Horário em Tempo Real:**
        * Um componente de Calendário interativo para escolha do dia.
        * Logo abaixo, uma grade (Grid) de botões representando os horários disponíveis (ex: `09:00`, `09:30`, `10:00`). Horários já reservados não aparecem ou ficam apagados/desabilitados.
* **Rodapé Fixo Inferior (Sticky Footer):**
    * Barra que aparece assim que o horário é selecionado: "Resumo: Corte Degradê - 14/10 às 15:00 - R$ 45,00" e o botão "Confirmar Agendamento".

---

## 3. Arquitetura de Telas (Visão Administrador/Barbeiro)
Para o gestor, o ambiente sai de "site" e entra em formato de **Dashboard Operacional**. O foco no desktop permite aproveitar telas largas (monitores no balcão da barbearia).

### Layout Base (Dashboard Padrão)
* **Menu Lateral (Sidebar - 20% da tela à esquerda):**
    * Logo.
    * Links de navegação: `Agenda do Dia`, `Serviços e Preços`, `Clientes`, `Configurações`, `Sair`.
* **Área Principal (80% da tela à direita):**
    * Cabeçalho com saudação ("Olá, [Nome do Barbeiro]"), data atual e botão rápido de "+ Novo Agendamento" (caso alguém agende presencialmente).

### Tela 3: Gestão Diária (A "Agenda")
É a tela que ficará aberta 90% do tempo no monitor da barbearia.

* **Métricas Rápidas (Topo):** 3 cartões exibindo: "Total de Cortes Hoje", "Previsão de Receita (R$)", "Taxa de Ocupação".
* **Visão de Calendário (Timeline / Grade Diária):**
    * Uma visualização vertical, das 08h às 20h, dividida em blocos de 30 ou 40 minutos.
    * **Horários Vazios:** Aparecem em cinza claro com a label "Disponível".
    * **Horários Preenchidos:** Aparecem como "Cartões" coloridos dentro da linha do tempo. Contêm: Nome do Cliente, Serviço (ex: Cabelo + Barba) e Valor.
* **Interações de Gestão:**
    * Ao clicar em um cartão de cliente agendado, um painel lateral direito (Offcanvas) se abre contendo as ações exigidas pelo PRD:
        * Botão "Remarcar" (Abre modal para trocar a data/hora).
        * Botão "Cancelar Agendamento" (Em vermelho, com prompt de confirmação para evitar cliques acidentais).

### Tela 4: Edição de Portfólio de Serviços
* **Lista Tabular (Tabela de Dados):**
    * Tabela horizontal listando: `Nome do Serviço` | `Descrição` | `Duração Média` | `Preço (R$)` | `Ações`.
    * A tabela no desktop permite visualização rápida sem scroll horizontal.
* **Ações:**
    * Ícone de lápis (Editar): Abre um Modal (janela sobreposta) simples contendo um formulário com os campos de Título, Preço e Tempo. Ao salvar, a alteração entra no banco de dados e reflete no fluxo do cliente instantaneamente.

---

## 4. Estratégia de Componentes e Micro-interações
* **Feedback Imediato (Toast Notifications):** Como o fluxo de barbeiros é rápido, ações como "Agendamento Cancelado" ou "Preço Atualizado" não devem recarregar a tela. Um alerta visual pequeno no canto superior direito ("Toast") verde deve confirmar o sucesso da operação.
* **Refresh Automático (Polling ou WebSockets):** A tela da agenda do barbeiro deve se atualizar sem precisar dar F5. Se um cliente confirmar um horário em casa, o bloco vazio no monitor do barbeiro deve ser preenchido sozinho.
* **Prevenção de Erros no Desktop:** Em telas largas, é fácil perder o cursor de vista. Os botões críticos (Cancelar, Excluir Serviço) devem ter estado de "Hover" (passar o mouse) bem claro, mudando de cor, e sempre exigir uma segunda confirmação.