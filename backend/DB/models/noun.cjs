"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Noun extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Noun.belongsTo(models.Noun, {
        foreignKey: {
          name: "parentId",
          allowNull: true,
        },
      });
    }
  }
  Noun.init(
    {
      tableName: DataTypes.STRING,
      slug: DataTypes.STRING,
      friendlyName: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Noun",
    }
  );
  return Noun;
};
