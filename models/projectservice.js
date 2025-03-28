import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class ProjectService extends Model {
  static associate(models) {
    ProjectService.belongsTo(models.Project, {
      foreignKey: "projectId",
    });
    ProjectService.belongsTo(models.Service, {
      foreignKey: "serviceId",
    });
  }
}

ProjectService.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Project ID harus diisi",
        },
        isInt: {
          msg: "Project ID harus berupa angka",
        },
      },
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Service ID harus diisi",
        },
        isInt: {
          msg: "Service ID harus berupa angka",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "ProjectService",
  }
);

export default ProjectService;
