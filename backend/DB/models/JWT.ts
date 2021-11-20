import S from "sequelize";
import { modelEvents } from "../../DB";
import { DefaultModelAttrs } from "./DefaultModelAttrs";
import { UserModel } from "./User";

const { Model, DataTypes } = S;

export class JWTModel
  extends Model<JWTAttributes, JWTCreationAttributes>
  implements JWTAttributes, DefaultModelAttrs
{
  public id!: number;
  public token!: string;
  public userId!: number;
  public jwtType!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface JWTAttributes {
  id: number;
  token: string;
  userId: number;
  jwtType: string;
}

export type JWTCreationAttributes = Omit<JWTAttributes, "id">;

export type JWT = JWTAttributes & DefaultModelAttrs;

modelEvents.once("init", (sequelize) => {
  JWTModel.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      token: DataTypes.STRING,
      userId: DataTypes.INTEGER.UNSIGNED,
      jwtType: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "JWT",
    }
  );

  JWTModel.belongsTo(UserModel);

  JWTModel.sync({
    alter: true,
  });
});
