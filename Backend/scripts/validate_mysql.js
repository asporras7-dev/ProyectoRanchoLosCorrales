require('dotenv').config();

console.log('🚀 ENV loaded →', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
});

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ MySQL connection successful (via Sequelize).'))
  .catch(err => console.error('❌ MySQL connection failed:', err));
