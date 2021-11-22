import { FieldCreationAttributes, FieldModel } from "../DB/models/Field.js";
import { NounModel } from "../DB/models/Noun.js";
import { router } from "../Router.js";
import { invalidRequest, notFound } from "../Utils/EndpointResponses.js";
import { body, validationResult, param } from "express-validator";

router.post<Params, ResponseBody, RequestBody>(
  "/api/nouns/:nounId/fields",
  body("fields").isArray(),
  body("fields.*.type").isString().trim().toLowerCase(),
  body("fields.*.columnName").isString().trim(),
  body("fields.*.friendlyName").isString().trim(),
  body("fields.*.activeStatus").isBoolean(),
  param("nounId").isInt().toInt(),

  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { nounId } = req.params;

    let noun: NounModel | null;
    try {
      noun = await NounModel.findByPk<NounModel>(req.params.nounId);
    } catch (err) {
      console.error(err);
      notFound(res, `No such noun with id '${req.params.nounId}'`);
      return;
    }

    const fieldsToCreate: FieldCreationAttributes[] = req.body.fields.map(
      (field) => {
        return {
          ...field,
          nounId,
        };
      }
    );

    const fields: FieldModel[] = await FieldModel.bulkCreate(fieldsToCreate);

    res.json(fields);
  }
);

export type FieldToCreate = Omit<FieldCreationAttributes, "nounId">;
interface Params {
  nounId: number;
}
interface RequestBody {
  fields: Array<FieldToCreate>;
}
type ResponseBody = Array<FieldModel>;
