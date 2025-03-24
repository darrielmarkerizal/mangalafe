"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProjectService extends Model {
    static associate(models) {
      models.ProjectService.belongsTo(models.Project, {
        foreignKey: "projectId",
      });
      models.ProjectService.belongsTo(models.Service, {
        foreignKey: "serviceId",
      });
    }
  }
  ProjectService.init(
    {
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProjectService",
    }
  );
  return ProjectService;
};
