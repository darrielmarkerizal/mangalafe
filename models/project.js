"use strict";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";
import Service from "./service.js";
import ProjectService from "./projectservice.js";

class Project extends Model {
  static associate(models) {
    Project.belongsToMany(models.Service, {
      through: "ProjectService",
      foreignKey: "projectId",
      otherKey: "serviceId",
    });
  }
}

Project.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    initiator: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    period: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
        min: 2000,
        max: 2100,
      },
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Project",
  }
);

export default Project;
