import app from './app';
import { Server } from 'http';
import { prisma } from './lib/prisma';

async function runTests() {
  console.log('🧪 Iniciando testes automatizados do fluxo de autenticação...\n');
  
  let server!: Server;
  const PORT = 4999; // porta isolada de teste
  const baseUrl = `http://localhost:${PORT}/api/auth`;

  // 1. Limpar banco de dados de teste (apenas tabela de usuários)
  console.log('🧹 Limpando tabela de usuários...');
  await prisma.user.deleteMany({});

  // 2. Iniciar servidor temporário
  await new Promise<void>((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor de testes rodando em http://localhost:${PORT}`);
      resolve();
    });
  });

  let testFailed = false;

  try {
    // ---- TESTE 1: Cadastro de Cliente com Sucesso ----
    console.log('\n----------------------------------------');
    console.log('📝 Teste 1: Cadastro de novo Cliente');
    const registerRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Cliente Teste',
        email: 'cliente@teste.com',
        password: 'senhasegura123',
        role: 'CLIENTE',
      }),
    });

    const registerData = await registerRes.json();
    if (registerRes.status !== 201) {
      throw new Error(`Falha no cadastro: status ${registerRes.status}, erro: ${JSON.stringify(registerData)}`);
    }
    if (!registerData.token) throw new Error('Token JWT não retornado no cadastro!');
    if (registerData.user.role !== 'CLIENTE') throw new Error('Role do usuário cadastrado não é CLIENTE!');
    console.log('✅ Teste 1 passou! Cliente cadastrado com sucesso e JWT gerado.');

    // ---- TESTE 2: Impedir Duplicação de E-mail ----
    console.log('\n----------------------------------------');
    console.log('📝 Teste 2: Impedir cadastro com e-mail duplicado');
    const registerDupRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Cliente Duplicado',
        email: 'cliente@teste.com', // mesmo e-mail
        password: 'outrasenha123',
        role: 'CLIENTE',
      }),
    });

    const registerDupData = await registerDupRes.json();
    if (registerDupRes.status !== 409) {
      throw new Error(`Deveria retornar 409 Conflict, retornou ${registerDupRes.status}`);
    }
    console.log('✅ Teste 2 passou! Bloqueou e-mail duplicado corretamente.');

    // ---- TESTE 3: Cadastro de Admin com Sucesso ----
    console.log('\n----------------------------------------');
    console.log('📝 Teste 3: Cadastro de novo Admin/Barbeiro');
    const registerAdminRes = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Barbeiro Chefe',
        email: 'barbeiro@teste.com',
        password: 'senhaadmin123',
        role: 'ADMIN',
      }),
    });

    const registerAdminData = await registerAdminRes.json();
    if (registerAdminRes.status !== 201) {
      throw new Error(`Falha no cadastro do admin: status ${registerAdminRes.status}`);
    }
    if (registerAdminData.user.role !== 'ADMIN') throw new Error('Role do usuário cadastrado não é ADMIN!');
    console.log('✅ Teste 3 passou! Admin/Barbeiro cadastrado com sucesso.');

    // ---- TESTE 4: Login de Usuário com Sucesso ----
    console.log('\n----------------------------------------');
    console.log('📝 Teste 4: Login de Cliente cadastrado');
    const loginRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'cliente@teste.com',
        password: 'senhasegura123',
      }),
    });

    const loginData = await loginRes.json();
    if (loginRes.status !== 200) {
      throw new Error(`Falha no login: status ${loginRes.status}`);
    }
    if (!loginData.token) throw new Error('Token JWT não retornado no login!');
    if (loginData.user.email !== 'cliente@teste.com') throw new Error('E-mail do usuário logado inválido!');
    console.log('✅ Teste 4 passou! Login efetuado e token JWT gerado.');

    // ---- TESTE 5: Rejeitar Credenciais Inválidas ----
    console.log('\n----------------------------------------');
    console.log('📝 Teste 5: Rejeitar login com senha incorreta');
    const loginFailRes = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'cliente@teste.com',
        password: 'senha_errada_aqui',
      }),
    });

    if (loginFailRes.status !== 401) {
      throw new Error(`Deveria retornar 401 Unauthorized, retornou ${loginFailRes.status}`);
    }
    console.log('✅ Teste 5 passou! Rejeitou credenciais incorretas.');

    console.log('\n========================================');
    console.log('🎉 Todos os testes de autenticação passaram!');
    console.log('========================================');
  } catch (error) {
    console.error('\n❌ Falha em um dos testes:', error);
    testFailed = true;
  } finally {
    console.log('🔌 Fechando conexões e finalizando servidor...');
    await prisma.$disconnect();
    server.close(() => {
      console.log('🛑 Servidor de testes parado.');
      process.exit(testFailed ? 1 : 0);
    });
  }
}

runTests();
