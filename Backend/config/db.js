const { Sequelize } = require('sequelize');
const config = require('./config');

// Crear instancia de Sequelize con los parámetros correctos

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql',
    port: process.env.DB_PORT || 3306,
  }
);

// Si el archivo se ejecuta directamente, validar la conexión
if (require.main === module) {
  sequelize.authenticate()
    .then(() => console.log('✅ Conexión a MySQL establecida correctamente usando Sequelize.'))
    .catch(err => console.error('❌ No se pudo conectar a MySQL:', err));
}

module.exports = sequelize;
