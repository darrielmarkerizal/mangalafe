import { sequelize } from "../../config/database";

/**
 * Tests the database connection
 * @returns {Promise<{success: boolean, message: string, databaseInfo?: {database: string, host: string, port: number|string, url: string}}>} - Result of the connection test
 */
export async function testDbConnection() {
  try {
    await sequelize.authenticate();

    // Mendapatkan informasi koneksi
    const { database, host, port, username } = sequelize.config;
    const dialect = sequelize.getDialect();
    // Membuat URL koneksi (tanpa password untuk keamanan)
    const connectionUrl = `${dialect}://${username}@${host}:${port}/${database}`;

    return {
      success: true,
      message: "✅ Database connection successful!",
      databaseInfo: {
        database,
        host,
        port,
        url: connectionUrl,
      },
    };
  } catch (error) {
    console.error("❌ Database connection error:", error);
    return {
      success: false,
      message: `Database connection failed: ${error.message}`,
      error,
    };
  }
}

/**
 * Tests the database connection and returns models status
 * @returns {Promise<{connection: boolean, models: {[key: string]: boolean}, message: string, databaseInfo?: {database: string, host: string, port: number|string, url: string}}>} - Connection and models status
 */
export async function checkDatabaseHealth() {
  try {
    // Test basic connection
    await sequelize.authenticate();

    // Mendapatkan informasi koneksi
    const { database, host, port, username } = sequelize.config;
    const dialect = sequelize.getDialect();
    // Membuat URL koneksi (tanpa password untuk keamanan)
    const connectionUrl = `${dialect}://${username}@${host}:${port}/${database}`;

    // Test models
    const modelStatus = {};
    const models = sequelize.models;

    // Get list of model names
    const modelNames = Object.keys(models);

    if (modelNames.length === 0) {
      return {
        connection: true,
        models: {},
        message: "Database connection successful, but no models were found.",
        databaseInfo: {
          database,
          host,
          port,
          url: connectionUrl,
        },
      };
    }

    // Test each model by querying for count
    for (const modelName of modelNames) {
      try {
        await models[modelName].count();
        modelStatus[modelName] = true;
      } catch (modelError) {
        console.error(`Error with model ${modelName}:`, modelError);
        modelStatus[modelName] = false;
      }
    }

    const allModelsOk = Object.values(modelStatus).every(
      (status) => status === true
    );

    return {
      connection: true,
      models: modelStatus,
      message: allModelsOk
        ? "✅ Database connection and all models are working correctly."
        : "⚠️ Database connection successful, but some models have issues.",
      databaseInfo: {
        database,
        host,
        port,
        url: connectionUrl,
      },
    };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return {
      connection: false,
      models: {},
      message: `Database connection failed: ${error.message}`,
      error,
    };
  }
}
