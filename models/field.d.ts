import { Model, Instance } from "sequelize/lib/model.js";

export type FieldInstance = Instance<FieldAttributes> & FieldAttributes;

export type FieldModel = Model<FieldInstance, FieldAttributes>;

export interface FieldAttributes {
  nounId: number;
  type: string;
  columnName: string;
  friendlyName: string;
  activeStatus: boolean;
}
