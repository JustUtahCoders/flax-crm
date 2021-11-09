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
      // models.IntakeFormItem.belongsTo(models.IntakeForm);

      models.Field.hasOne(models.IntakeFormItem, {
        foreignKey: {
          name: "fieldId",
          allowNull: true,
        },
      });
      // models.IntakeFormItem.belongsTo(models.Field);

      models.IntakeFormQuestion.hasOne(models.IntakeFormItem, {
        foreignKey: {
          name: "intakeFormQuestionId",
          allowNull: true,
        },
      });
      // models.IntakeFormItem.belongsTo(models.IntakeFormQuestion);

      models.IntakeFormItem.hasMany(models.IntakeFormItem, {
        as: "pageChildren",
        foreignKey: {
          name: "pageId",
          allowNull: true,
        },
      });
      // models.IntakeFormItem.belongsTo(models.IntakeFormItem);

      models.IntakeFormItem.hasMany(models.IntakeFormItem, {
        as: "sectionChildren",
        foreignKey: {
          name: "sectionId",
          allowNull: true,
        },
      });
      // models.IntakeFormItem.belongsTo(models.IntakeFormItem);
    }
  }
  IntakeFormItem.init(
    {
      type: DataTypes.STRING,
      intakeFormId: DataTypes.INTEGER,
      fieldId: DataTypes.INTEGER,
      intakeFormQuestionId: DataTypes.INTEGER,
      pageId: DataTypes.INTEGER,
      sectionId: DataTypes.INTEGER,
      orderIndex: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "IntakeFormItem",
    }
  );
  return IntakeFormItem;
};
