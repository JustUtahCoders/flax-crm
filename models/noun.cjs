"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class noun extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.noun.belongsTo(models.noun, {
        foreignKey: {
          name: "parentId",
          allowNull: true,
        },
      });
    }
  }
  noun.init(
    {
      tableName: DataTypes.STRING,
      slug: DataTypes.STRING,
      friendlyName: DataTypes.STRING,
      parentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "noun",
    }
  );
  return noun;
};
