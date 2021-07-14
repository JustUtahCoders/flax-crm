import { Model, Instance } from "sequelize/lib/model.js";

type NounInstance = Instance<NounAttributes> & NounAttributes;

export type NounModel = Model<NounInstance, NounAttributes>;

export interface NounAttributes {
  tableName: string;
  slug: string;
  friendlyName: string;
  parentId: string;
}
