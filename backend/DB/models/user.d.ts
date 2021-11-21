import { Model } from "sequelize";
import { DefaultModelAttrs } from "./defaults";

export type UserModel = Model<UserAttributes>;

export interface UserAttributes {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  googleAuthToken: string;
}

export type User = UserAttributes & DefaultModelAttrs;
