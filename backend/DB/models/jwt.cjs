"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JWT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.JWT.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  JWT.init(
    {
      token: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      jwtType: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "JWT",
    }
  );
  return JWT;
};
