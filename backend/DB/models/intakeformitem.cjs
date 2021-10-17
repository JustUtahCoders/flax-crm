"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IntakeFormItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.IntakeForm.hasMany(models.IntakeFormItem, {
        foreignKey: {
          name: "intakeFormId",
          allowNull: false,
        },
      });

      models.Field.hasMany(models.IntakeFormItem, {
        foreignKey: {
          name: "fieldId",
          allowNull: true,
        },
      });

      models.IntakeFormQuestion.hasMany(models.IntakeFormItem, {
        foreignKey: {
          name: "intakeFormQuestionId",
          allowNull: true,
        },
      });

      models.IntakeFormItem.hasMany(models.IntakeFormItem, {
        foreignKey: {
          name: "pageId",
          allowNull: true,
        },
      });

      models.IntakeFormItem.hasMany(models.IntakeFormItem, {
        foreignKey: {
          name: "sectionId",
          allowNull: true,
        },
      });
    }
  }
  IntakeFormItem.init(
    {
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "IntakeFormItem",
    }
  );
  return IntakeFormItem;
};
