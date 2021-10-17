"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IntakeFormQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  IntakeFormQuestion.init(
    {
      label: DataTypes.STRING,
      placeholderText: DataTypes.STRING,
      required: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "IntakeFormQuestion",
    }
  );
  return IntakeFormQuestion;
};
