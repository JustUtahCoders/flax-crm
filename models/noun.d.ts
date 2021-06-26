import Model from "sequelize/lib/model.js";

export abstract class NounModel extends Model<Noun> {}

export interface Noun {
  tableName: string;
  slug: string;
  friendlyName: string;
  parentId: string;
}
