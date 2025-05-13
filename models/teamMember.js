"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class TeamMember extends Model {
    static associate(models) {
      // define association here if needed
    }
  }

  TeamMember.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      displayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "TeamMember",
    }
  );

  return TeamMember;
};
