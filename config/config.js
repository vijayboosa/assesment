// config/config.js
import dotenv from 'dotenv';
dotenv.config();

// In have different config for each environment
// prod, dev, test configs
// for now single config is enough
const config = {
  clientUrl: process.env.CLIENT_URL,
  port: process.env.PORT,
  // db config
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  db_port: process.env.DB_PORT,
  dialect: 'mysql',

  jwtSecret: process.env.JWT_SECRET || 'default_secret', // Use a strong secret in production
};

export default config;
