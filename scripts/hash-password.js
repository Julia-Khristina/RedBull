// Script para gerar hash bcrypt 
// Uso: node scripts/hash-password.js "minha-senha"

const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.error('Uso: node scripts/hash-password.js "minha-senha"');
  process.exit(1);
}

const saltRounds = 10;
const hash = bcrypt.hashSync(password, saltRounds);
console.log('\nHash gerado (adicione ao .env):');
console.log('ADMIN_PASSWORD_HASH=' + hash);
console.log('\nNunca compartilhe esse hash com quem não tenha acesso ao .env.');
