1. Gestão de Estado Centralizada (Zustand)
  A fundação desta fase foi a criação da useBookingStore.ts, responsável por gerenciar o "carrinho" de agendamento sem a
  necessidade de recarregar a página.

   * Estados Criados: selectedService (objeto completo do serviço), selectedDate (data escolhida) e selectedTime
     (horário da vaga).
   * Lógica Inteligente: Implementamos um comportamento onde, ao trocar de serviço ou de data, o horário selecionado é
     automaticamente resetado. Isso evita erros de agendamento, garantindo que o cliente sempre escolha uma vaga válida
     para a nova configuração selecionada.
   * Cálculo Reativo: Uma função getTotal() foi adicionada para refletir instantaneamente o preço do serviço no rodapé
     da página.

  2. Componentização da Interface (Split Screen)
  Seguindo o Documento de Design, dividimos a interface em componentes especializados para evitar sobrecarga de
  informação:

   * ServiceSelector.tsx (Coluna Esquerda - 40%):
       * Consome a API de serviços em tempo real.
       * Exibe Cards interativos com estados de seleção marcados por uma borda dourada (#D4AF37).
   * DateTimeSelector.tsx (Coluna Direita - 60%):
       * Calendário Dinâmico: Gera automaticamente os próximos 7 dias a partir da data atual.
       * Grid de Horários: Apresenta as vagas disponíveis em um formato de botões rápidos. O horário selecionado assume
         a cor dourada com texto escuro para máximo contraste.

  3. Experiência do Usuário (UX) e Layout
  A montagem final na BookingPage.tsx consolidou os componentes em um layout de tela dividida que se adapta a diferentes
  dispositivos.

   * Layout Adaptável: No desktop, mantemos a visão de duas colunas (agilidade). No mobile, as seções se empilham
     verticalmente (conforto).
   * Sticky Footer (Rodapé Fixo):
       * Atua como o "finalizador" do checkout.
       * Permanece oculto ou em estado passivo até que o cliente complete o trio: Serviço + Data + Hora.
       * Apresenta um resumo claro do agendamento antes da confirmação final.
   * Feedback Visual: Integração com o sistema de Toast Notifications. Ao confirmar, o usuário recebe um alerta verde de
     sucesso e é redirecionado para a página inicial.

  4. Estilização e Identidade Visual
  A aplicação do CSS seguiu rigorosamente o tema Dark Mode:
   * Fundo: #121212.
   * Superfícies (Cards/Footer): #2A2A2A (Cinza Chumbo).
   * Destaques: Uso extensivo de Dourado/Cobre (#D4AF37) para guiar a atenção do usuário para as ações principais.
   * Tipografia: Montserrat/Oswald para títulos e Inter para textos de leitura, garantindo clareza e elegância.

  5. Qualidade Técnica
   * TypeScript: Todos os componentes e stores foram tipados, garantindo que os dados do serviço (id, título, preço,
     etc.) fluam sem erros entre o front e o back.
   * Build de Produção: O código foi validado com npm run build, confirmando que não há erros de tipagem ou arquivos
     ausentes, estando pronto para deploy.