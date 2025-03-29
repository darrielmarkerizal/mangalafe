import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

class Service extends Model {
  static associate(models) {
    Service.belongsToMany(models.Project, {
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
        notEmpty: {
          msg: "Nama layanan harus diisi",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "Service",
  }
);

export default Service;
