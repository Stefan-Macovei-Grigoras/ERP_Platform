const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // ✅ this was undefined before
    port: Number(process.env.DB_PORT),
    logging: console.log,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to the database successfully.');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error.message);
    process.exit(1); // Stop app if DB fails
  }
};


module.exports = { sequelize, connectToDB };
