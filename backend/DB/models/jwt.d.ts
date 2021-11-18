import { Model } from "sequelize";
import { DefaultModelAttrs } from "./defaults";

export type JWTModel = Model<JWTAttributes>;

export interface JWTAttributes {
  token: string;
  userId: number;
  jwtType: string;
}

export type JWT = JWTAttributes & DefaultModelAttrs;
