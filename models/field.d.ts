import { Model } from "sequelize/lib/model.js";
import { DefaultModelAttrs } from "./defaults";
import { NounAttributes } from "./noun";

export type FieldModel = Model<FieldAttributes>;

export interface FieldAttributes {
  nounId: number;
  type: string;
  columnName: string;
  friendlyName: string;
  activeStatus: boolean;
}

export type Field = NounAttributes & DefaultModelAttrs;
