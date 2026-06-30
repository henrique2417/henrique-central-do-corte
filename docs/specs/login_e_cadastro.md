Especificação Funcional e Técnica: Login e Cadastro — Central do Corte (`Spec.md`)

Visão Geral
Este documento especifica detalhadamente os requisitos, fluxos, regras de negócio e a implementação técnica (front-end e back-end) dos módulos de Autenticação (Login e Cadastro) da plataforma **Central do Corte**. O objetivo principal é garantir um mecanismo seguro, reativo e aderente à identidade visual premium do sistema, permitindo a correta diferenciação entre os perfis de **Cliente** e **Administrador/Barbeiro**.

---

2. Arquitetura do Back-end

2.1. Modelagem de Dados (Prisma ORM)
O esquema de banco de dados utiliza o Prisma ORM para gerenciar a entidade de usuários, aplicando uma separação clara de papéis de acesso (*roles*).

```prisma
datasource db {
  provider = "postgresql" // ou sqlite/mysql conforme o ambiente
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  CLIENTE
  ADMIN
}

model User {
  id        String   @id @default(uuid())
  nome      String
  email     String   @unique
  senha     String
  role      Role     @default(CLIENTE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

2.2. Endpoints da API (Express)
O servidor Express expõe rotas sob o prefixo /api/auth/ e responde na porta padrão de desenvolvimento (http://localhost:4000).

A. Registro de Usuário (POST /api/auth/register)
Payload de Entrada:

JSON
{
  "nome": "Henrique Silva",
  "email": "henrique@email.com",
  "senha": "SenhaSegura123",
  "role": "CLIENTE"
}

Comportamento:

Valida se todos os campos obrigatórios estão presentes.

Consulta o banco de dados para verificar se o e-mail já está cadastrado. Se estiver, retorna erro 400 Bad Request.

Criptografa a senha utilizando bcryptjs com um fator de custo (salt) igual a 10.

Salva o novo registro no banco de dados através do Prisma Client.

Retorna sucesso 201 Created junto com os dados públicos do usuário e o token de acesso.

B. Login de Usuário (POST /api/auth/login)
Payload de Entrada:

JSON
{
  "email": "henrique@email.com",
  "senha": "SenhaSegura123"
}
Comportamento:

Localiza o usuário pelo e-mail informado. Caso não exista, retorna 401 Unauthorized com mensagem genérica (Prevenção de enumeração de usuários).

Compara o hash da senha armazenada com a senha enviada usando bcryptjs.compare(). Se divergir, retorna 401 Unauthorized.

Gera um token JWT (JSON Web Token) assinado com a chave secreta definida nas variáveis de ambiente (JWT_SECRET), contendo no payload o id, email e role do usuário. O token expira em 7 dias.

Retorna status 200 OK contendo o token e o objeto do usuário (sem a senha).

2.3. Segurança e Regras do Servidor
CORS (Cross-Origin Resource Sharing): Configurado explicitamente para aceitar e validar requisições originadas do domínio do front-end (http://localhost:5173), utilizando o pacote cors.

Criptografia: Senhas em texto limpo nunca são armazenadas ou trafegadas internamente após a validação inicial.

Hot-Reload: Em ambiente de desenvolvimento, o servidor executa através do comando tsx watch src/index.ts, garantindo reinicializações automáticas após qualquer modificação.

3. Arquitetura do Front-end (React & Zustand)
3.1. Gerenciamento de Estado Global (authStore.ts)
A lógica de autenticação é centralizada em uma store do Zustand localizada em src/stores/authStore.ts. Ela encapsula o estado de carregamento, erros e os dados do usuário corrente.

Estrutura do Estado:

user: Objeto com id, nome, email, role (ou null).

token: String do JWT (ou null).

isAuthenticated: Booleano derivado.

isLoading: Booleano para controle de spinners/desabilitação de botões.

Ações Assíncronas:

login(email, senha): Dispara requisição HTTP para a API. Em caso de sucesso, preenche as variáveis de estado, armazena o token e o JSON do usuário no localStorage e aciona o Toast de sucesso. Se falhar, limpa o estado e propaga o erro para o componente visual por meio de um Toast de erro.

register(nome, email, senha, role): Executa a chamada de criação de conta. Segue o mesmo padrão de preenchimento de estado e tratamento de erros do login.

logout(): Redefine o estado para os valores nulos iniciais e expurga os dados guardados no localStorage.

Persistência de Sessão:
A store inicializa lendo o localStorage do navegador. Se um token válido e dados de usuário forem encontrados, o estado isAuthenticated é definido imediatamente como verdadeiro, evitando que o usuário precise logar novamente ao recarregar a página (F5).

3.2. Integração com Serviços (api.ts)
As chamadas HTTP são centralizadas em um módulo de serviço (src/services/api.ts). Ele implementa um interceptor manual ou via Axios que injeta de maneira transparente o cabeçalho HTTP de autorização em todas as requisições subsequentes:

HTTP
Authorization: Bearer <token_jwt>
Nota: Mantém-se um fallback de dados simulados ativo apenas para endpoints que ainda não foram totalmente espelhados no back-end, isolando erros e permitindo a continuidade dos testes da interface.

4. Design, Componentes e UI/UX (Look & Feel)
4.1. Diretrizes Visuais Estritas
A interface obedece rigidamente aos padrões visuais escuros e sofisticados definidos para o ambiente da barbearia, utilizando as seguintes variáveis CSS:

Fundo Geral (Vite Root/Body): Cinza Escuro (#121212 a #1A1A1A).

Superfícies Formulárias (Cards): Cinza Chumbo (#2A2A2A).

Ações Primárias (Accent Buttons): Dourado/Cobre (#D4AF37 ou #E5A93B).

Tipografia: Títulos principais estilizados com as fontes Oswald ou Montserrat em tom Branco Gelo (#F5F5F5). Textos de apoio, placeholders e rótulos utilizam Roboto ou Inter em Cinza Claro (#B0B0B0).

Feedbacks Utilitários: Toasts de sucesso na cor Verde (#4CAF50) e alertas de erro/validação na cor Vermelha (#F44336).

4.2. Componentes Estruturais (src/features/auth/)
LoginForm.tsx: Contém campos reativos para entrada de e-mail e senha. Aplica estados visuais de hover e foco com bordas douradas sutis nos inputs.

RegisterForm.tsx: Inclui campos para Nome, E-mail, Senha e Confirmação de Senha. Conta com um seletor explícito de perfil (Cliente ou Administrador) integrado de forma harmoniosa no layout para simplificar testes operacionais e homologação de fluxos.

Estilização (AuthForm.css): Define efeitos de transição suaves e uma classe específica de brilho ao passar o mouse sobre os botões dourados (gold glow hover), preservando a usabilidade em telas desktop e guiando o cursor do usuário de forma clara.

4.3. Feedbacks Imediatos e Prevenção de Erros (src/components/feedback/)
ToastContainer.tsx e ToastContainer.css: Posicionados na raiz da aplicação (App.tsx). Toda vez que uma ação assíncrona da authStore falha (como uma senha incorreta ou e-mail duplicado) ou é bem-sucedida, uma notificação flutuante com animação de entrada (slide-in) surge no canto superior direito da tela sem recarregar a interface.

Validações Client-Side: Os botões de submissão entram em estado desabilitado (disabled) enquanto isLoading for verdadeiro. Validações locais conferem se a senha possui o tamanho mínimo de 6 caracteres e se a confirmação de senha é idêntica à digitada originalmente antes de realizar o envio dos dados à API.

5. Fluxos de Navegação e Roteamento Inteligente
A página centralizadora LoginPage.tsx (localizada em src/pages/auth/) encapsula os formulários e gerencia uma alternância suave e animada de estados entre a visualização de login e a de cadastro, eliminando transições bruscas de tela.

5.1. Regra de Redirecionamento Baseado em Papel (Role-Based Routing)
Um gancho reativo (useEffect) monitora continuamente o estado de autenticação do usuário na authStore. Assim que a validação é concluída com sucesso, o sistema analisa a role atribuída ao perfil e dispara de forma assíncrona o redirecionamento automático via react-router-dom:

Se user.role === 'ADMIN': O usuário é encaminhado para o Dashboard Operacional, acessando a rota da agenda em /admin/agenda.

Se user.role === 'CLIENTE': O usuário é encaminhado para a interface de agendamento em Split Screen, acessando a rota /agendar.

6. Critérios de Aceite e Validação Técnica
Para considerar a funcionalidade concluída e apta para produção, os seguintes testes automatizados e verificações devem apresentar conformidade absoluta:

Integridade de Tipagem: A execução do verificador estático do TypeScript através do comando npx tsc --noEmit deve resultar em sucesso absoluto com zero erros ou avisos em ambos os repositórios (front-end e back-end).

Criptografia de Senha: Nenhuma senha em texto claro pode ser salva no banco de dados. Uma consulta direta via Prisma Studio deve exibir a senha do usuário em formato de hash Bcrypt.

Persistência pós F5: Ao logar na aplicação, atualizar a página do navegador não pode forçar o deslogamento do usuário nem exibir flashes de tela branca.

Isolamento de CORS: Tentativas de requisições disparadas por clientes HTTP externos não autorizados ou outras portas locais sem configuração devem ser sumariamente bloqueadas pelo middleware de segurança do Express.