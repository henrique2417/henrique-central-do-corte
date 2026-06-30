  1. Back-end: Portfólio de Serviços (CRUD)
  O foco inicial foi consolidar o gerenciamento do portfólio de serviços no servidor para que o administrador possa
  gerenciar os cortes e preços e o cliente final possa visualizá-los.

   * Criação do Controller de Serviços (server/src/controllers/serviceController.ts):
    Implementamos as operações fundamentais de CRUD utilizando o Prisma Client conectado ao banco de dados SQLite.
  Adicionamos validações de integridade e tratamento robusto de erros:
     * getServices: Busca e retorna todos os serviços ordenados alfabeticamente por título.
     * createService: Valida a obrigatoriedade do título (mínimo de 3 caracteres), duração positiva (em minutos) e preço
       válido. Cria o registro no banco com status inicial de "ATIVO".
     * updateService: Verifica se o serviço existe e realiza atualizações parciais (PATCH-style) de campos como título,
       descrição, duração, preço e status.
     * deleteService: Permite a remoção física (hard delete) de um serviço após validar sua existência no banco.

   * Configuração e Registro de Rotas de Serviço (server/src/app.ts & serviceRoutes.ts):
     * Integramos as funções do controlador no roteador Express (server/src/routes/serviceRoutes.ts).
     * Aplicamos autenticação baseada em perfis (RBAC): a listagem (GET /) é pública para que novos visitantes possam
       visualizar o portfólio, enquanto as rotas de criação, edição e exclusão estão estritamente protegidas por
       middlewares que exigem autenticação de administrador (authenticateToken e requireAdmin).
     * Registramos globalmente o endpoint em /api/services no arquivo principal do servidor (app.ts).
     * Status de Compilação: O servidor está compilando sem erros (tsc executado com sucesso).

  ---

  2. Front-end: Landing Page Premium do Cliente
  Com o back-end operacional, implementamos a vitrine de entrada do sistema voltada para os clientes finais.

   * Construção do Componente React (src/pages/client/LandingPage.tsx):
     * Header Dinâmico: Apresenta o logotipo estilizado e um menu inteligente. Se o cliente estiver deslogado, exibe um
       botão "Entrar" (/login). Se estiver logado, exibe uma mensagem personalizada de boas-vindas ("Olá, [Nome]"),
       atalhos para o Painel Administrativo (caso seja ADMIN) e um botão de logout funcional acoplado ao Zustand Store.
     * Hero Section: Adiciona um cabeçalho de alto impacto visual ("Seu tempo é valioso. Agende seu corte sem filas.")
       sobre a imagem hero.png utilizando uma máscara de gradiente escuro e o CTA (Call to Action) principal para a tela
       de agendamentos (/agendar).
     * Integração com a API (Fetch & Estado): Criamos rotinas assíncronas utilizando useEffect para buscar os serviços
       diretamente da rota pública do back-end (http://localhost:4000/api/services). Implementamos estados visuais de
       carregamento (loading), tratamento de erros e estado vazio.
     * Renderização do Portfólio: Filtra e exibe de forma reativa apenas os serviços com status "ATIVO", apresentando-os
       em um Grid de Cards interativos com Título, Descrição, Duração em minutos e o preço devidamente formatado na
       moeda brasileira (R$).

   * Estilização com Design System Premium (src/pages/client/LandingPage.css):
     * Desenvolvemos a folha de estilos do zero para seguir estritamente as diretrizes de Dark Mode do documento de
       design.
     * Integramos as variáveis de CSS globais (--bg-main de #121212, superfícies de --surface de #2A2A2A e --border para
       criar profundidade).
     * Aplicamos a cor de destaque Dourada (#D4AF37) para as interações, estados de hover dinâmicos nos botões e nos
       cards (com leves transições de elevação em escala e brilho).
     * Criamos uma experiência 100% responsiva com Media Queries dedicadas para celulares e tablets.

  ---

  3. Correções Arquiteturais e de Build de Produção
  Para garantir que a aplicação estivesse operacional de ponta a ponta, resolvemos dois grandes gargalos técnicos:

   * Correção no Fluxo de Roteamento (src/App.tsx):
     * Identificamos que a rota raiz / (Landing Page) estava incorretamente envelopada pelo wrapper ProtectedRoute
       allowedRole="CLIENTE". Isso impedia que novos visitantes sem cadastro pudessem acessar o site (eram
       redirecionados imediatamente para o login).
     * Tornamos a rota / pública. Agora o visitante acessa a Landing Page, consulta os serviços e preços de forma
       autônoma e é direcionado para fazer login/cadastro apenas se decidir de fato prosseguir com o agendamento de
       horário (/agendar).

   * Correção no Build de Produção (src/pages/auth/LoginPage.tsx):
     * Havia uma declaração não utilizada do objeto React no arquivo de login que estava quebrando o compilador
       TypeScript sob a regra estrita de lint do projeto.
     * Removemos o import desnecessário, garantindo que o build de produção do frontend (tsc -b && vite build) seja
       gerado perfeitamente e sem erros.
