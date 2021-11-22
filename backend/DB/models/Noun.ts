import S from "sequelize";
import { modelEvents } from "../../DB";
import { DefaultModelAttrs } from "./DefaultModelAttrs";

const { Model, DataTypes } = S;

export class NounModel
  extends Model<NounAttributes, NounCreationAttributes>
  implements NounAttributes, DefaultModelAttrs
{
  public id!: number;
  public tableName!: string;
  public slug!: string;
  public friendlyName!: string;
  public parentId?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

modelEvents.once("init", (sequelize) => {
  NounModel.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      tableName: DataTypes.STRING,
      slug: DataTypes.STRING,
      friendlyName: DataTypes.STRING,
      parentId: DataTypes.INTEGER.UNSIGNED,
    },
    {
      sequelize,
      modelName: "Noun",
    }
  );

  NounModel.belongsTo(NounModel, {
    foreignKey: {
      name: "parentId",
      allowNull: true,
    },
  });

  NounModel.sync({
    alter: true,
  });
});

export interface NounAttributes {
  id: number;
  tableName: string;
  slug: string;
  friendlyName: string;
  parentId?: number;
}

export type NounCreationAttributes = Omit<NounAttributes, "id">;

export type Noun = NounAttributes & DefaultModelAttrs;
