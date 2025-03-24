"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    static associate(models) {
      models.Service.belongsToMany(models.Project, {
        through: "ProjectService",
        foreignKey: "serviceId",
        otherKey: "projectId",
      });
    }
  }
  Service.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Service",
    }
  );
  return Service;
};
