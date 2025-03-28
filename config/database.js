import { Sequelize } from "sequelize";
import mysql2 from "mysql2";

let sequelize;

if (!global.sequelize) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      dialectModule: mysql2,
      port: process.env.DB_PORT || 3306,
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
  global.sequelize = sequelize;
} else {
  sequelize = global.sequelize;
}

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

export { sequelize, testConnection };
