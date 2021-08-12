import { Model } from "sequelize/lib/model.js";
import { DefaultModelAttrs } from "./defaults";

export type FieldModel = Model<FieldAttributes>;

export interface FieldAttributes {
  nounId: number;
  type: string;
  columnName: string;
  friendlyName: string;
  activeStatus: boolean;
}

export type Field = FieldAttributes & DefaultModelAttrs;
