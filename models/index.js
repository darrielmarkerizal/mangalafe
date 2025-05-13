"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import mysql2 from "mysql2";

// Importing models
import User from "./user.js";
import Service from "./service.js";
import Project from "./project.js";
import ProjectService from "./projectservice.js";
import TeamMember from "./teamMember.js";

// Load environment variables
dotenv.config();

// Set up dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
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

// Add models to db object
db.User = User;
db.Service = Service;
db.Project = Project;
db.ProjectService = ProjectService;
db.TeamMember = TeamMember;

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
