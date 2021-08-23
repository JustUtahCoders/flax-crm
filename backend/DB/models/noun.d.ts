import { Model } from "sequelize";
import { DefaultModelAttrs } from "./defaults";

export type NounModel = Model<NounAttributes>;

export interface NounAttributes {
  tableName: string;
  slug: string;
  friendlyName: string;
  parentId: string;
}

export type Noun = NounAttributes & DefaultModelAttrs;
