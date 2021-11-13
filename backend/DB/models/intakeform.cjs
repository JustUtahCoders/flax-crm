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
      models.IntakeForm.belongsTo(models.Noun, {
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
      nounId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "IntakeForm",
    }
  );
  return IntakeForm;
};
