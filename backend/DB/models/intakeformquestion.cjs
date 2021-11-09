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
      models.IntakeFormItem.belongsTo(models.IntakeFormQuestion, {
        foreignKey: {
          name: "intakeFormQuestionId",
          allowNull: true,
        },
      });
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
