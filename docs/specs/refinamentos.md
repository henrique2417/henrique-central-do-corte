# Especificação Funcional e Técnica: UX e Refinamento (Fase 5) — Central do Corte

## 1. Visão Geral
Este documento especifica os detalhes de implementação da **Fase 5 (UX e Refinamento)** da plataforma Central do Corte. Esta fase final teve como objetivo principal elevar a qualidade da interface, substituindo alertas nativos do navegador por componentes customizados, implementando estados de carregamento (loading) suaves e adicionando micro-interações visuais que reforçam a identidade *Premium* em *Dark Mode*.

---

## 2. Componentes de Prevenção e Feedback (UI/UX)

Para cumprir a regra de negócio de "Prevenção de Falhas Críticas", criamos componentes dedicados a confirmar ações destrutivas e indicar processamento assíncrono.

### 2.1. Prompt de Confirmação (`ConfirmPrompt.tsx`)
Substituto oficial do `window.confirm` nativo do navegador, garantindo alinhamento total com o *Dark Mode* do sistema.
* **Estrutura Visual:** Renderizado como um modal compacto e centralizado, com um *backdrop* (fundo escurecido) focado em atrair a atenção imediata do usuário.
* **Propriedades (Props):** Controlado pelos parâmetros `isOpen`, `title`, `message`, `onConfirm` e `onCancel`.
* **Ações e Cores:** * Botão de "Cancelar" adota o estilo *Ghost/Outline* (discreto, apenas com bordas).
  * Botão de confirmação de exclusão utiliza obrigatoriamente a cor Vermelha de perigo (`#F44336` / `var(--status-danger)`), deixando clara a intenção destrutiva da ação.

### 2.2. Indicador de Carregamento (`LoadingSpinner.tsx`)
Criado para fornecer feedback visual elegante enquanto o sistema aguarda respostas da API.
* **Design:** Um *spinner* minimalista e circular que utiliza a cor de destaque Dourado/Cobre (`#D4AF37` / `var(--accent)`).
* **Flexibilidade:** Suporta a propriedade `size` (`sm`, `md`, `lg`), permitindo ser usado tanto dentro de botões pequenos quanto no centro de grandes painéis de carregamento.

---

## 3. Refinamento de Funcionalidades Existentes

Os componentes construídos nas fases anteriores foram refatorados para consumir o novo ecossistema de UX.

### 3.1. Telas de Edição (Modais e Offcanvas)
* **`ServiceModal.tsx` (Portfólio):** A exclusão de um serviço deixou de disparar um alerta brusco do navegador. Agora, ao clicar em "Excluir Serviço", o estado local `isConfirmOpen` é ativado, sobrepondo o `<ConfirmPrompt />`. O serviço só é deletado após o clique no botão vermelho de confirmação.
* **`AppointmentOffcanvas.tsx` (Agenda):** O cancelamento de um agendamento da *Timeline* também foi integrado ao `<ConfirmPrompt />`. Apenas mediante a segunda validação o sistema processa a liberação do horário.

### 3.2. Carregamento do Portfólio (`PortfolioPage.tsx`)
A `PortfolioPage` foi atualizada para exibir o componente `<LoadingSpinner size="lg" />` no centro da tabela de dados durante o processamento do *fetch* (`GET /api/services`), substituindo antigas `divs` estáticas e garantindo que o barbeiro saiba que o sistema está buscando as informações em tempo real.

---

## 4. Micro-interações e Animações (CSS)

Para garantir que a interface responda de forma fluida e convidativa aos movimentos do mouse no desktop, um arquivo dedicado de estilos utilitários foi implementado (`src/styles/animations.css`).

### Classes Utilitárias Adicionadas:
* **`.hover-lift`:** Quando aplicada a botões ou *Cards* (como os da Agenda), faz com que o elemento sofra uma leve elevação (`transform: translateY(-2px)`) ao receber o foco do mouse.
* **`.hover-glow`:** Adiciona um efeito de iluminação (*box-shadow*) utilizando o tom Dourado/Cobre translúcido (`rgba(212, 175, 55, 0.15)`) nas bordas do elemento interagido, combinando perfeitamente com o fundo escuro (`#121212`).
* **`@keyframes pulse-gold`:** Uma animação global pulsante de dois segundos criada para chamar a atenção do usuário para elementos que exigem ação imediata (como horários marcados pendentes), expandindo e contraindo uma sombra dourada de forma cíclica e suave.

---
