require('dotenv').config();


// Debug: show loaded environment variables (no secrets)
console.log('🚀 ENV loaded →', {
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  DB_PORT: process.env.DB_PORT
});

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },
  server: {
    port: process.env.DB_PORT || 3306
  },
  jwtSecret: process.env.JWT_SECRET || 'parrillada_jwt_secret_key_2026_default_secure'
};

