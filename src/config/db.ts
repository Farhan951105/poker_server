import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: 'mysql',
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();          // auto‑create tables
    console.log('MySQL connected & synced');
  } catch (err) {
    console.error('DB error:', err);
    process.exit(1);
  }
};
