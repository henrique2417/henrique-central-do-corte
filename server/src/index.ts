import dotenv from 'dotenv';
import path from 'path';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import app from './app';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  Central do Corte Backend iniciado com sucesso! `);
  console.log(`  Rodando na porta: http://localhost:${PORT}      `);
  console.log(`=================================================`);
});
