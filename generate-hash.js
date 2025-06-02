const bcrypt = require('bcrypt');

const password = process.argv[2] || 'admin123'; // Puedes pasar la contraseña como argumento

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error generando el hash:', err);
    process.exit(1);
  }
  console.log(`Hash para "${password}":\n${hash}`);
}); 