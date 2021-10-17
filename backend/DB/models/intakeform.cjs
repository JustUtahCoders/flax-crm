"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class IntakeForm extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Noun.hasMany(models.IntakeForm, {
        foreignKey: {
          name: "nounId",
          allowNull: false,
        },
      });
    }
  }
  IntakeForm.init(
    {
      title: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "IntakeForm",
    }
  );
  return IntakeForm;
};
