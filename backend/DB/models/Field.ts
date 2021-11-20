import S from "sequelize";
import { modelEvents } from "../../DB";
import { NounModel } from "./noun";
import { DefaultModelAttrs } from "./DefaultModelAttrs";

const { Model, DataTypes } = S;

export class FieldModel extends Model<
  FieldAttributes,
  FieldCreationAttributes
> {
  public id!: number;
  public nounId!: number;
  public type!: string;
  public columnName!: string;
  public friendlyName!: string;
  public activeStatus!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface FieldAttributes {
  id: number;
  nounId: number;
  type: string;
  columnName: string;
  friendlyName: string;
  activeStatus: boolean;
}

export type FieldCreationAttributes = Omit<FieldAttributes, "id">;

export type Field = FieldAttributes & DefaultModelAttrs;

modelEvents.once("init", (sequelize) => {
  FieldModel.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      nounId: DataTypes.INTEGER.UNSIGNED,
      type: DataTypes.STRING,
      columnName: DataTypes.STRING,
      friendlyName: DataTypes.STRING,
      activeStatus: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Field",
    }
  );

  NounModel.hasMany(FieldModel, {
    foreignKey: {
      name: "nounId",
      allowNull: false,
    },
  });

  FieldModel.sync({
    alter: true,
  });
});
