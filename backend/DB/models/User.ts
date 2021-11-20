import S from "sequelize";
import { DefaultModelAttrs } from "./DefaultModelAttrs";
import { modelEvents } from "../../DB";

const { Model, DataTypes } = S;

export class UserModel
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password: string | null;
  public googleAuthToken: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string | null;
  googleAuthToken: string | null;
}

export type UserCreationAttributes = Omit<UserAttributes, "id">;

export type User = UserAttributes & DefaultModelAttrs;

modelEvents.once("init", (sequelize) => {
  UserModel.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      googleAuthToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
});
