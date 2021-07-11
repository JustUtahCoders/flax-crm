import { FieldAttributes, FieldModel } from "../../models/field.js";
import { NounAttributes, NounModel } from "../../models/noun.js";
import { sequelize } from "../DB.js";
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

    let noun: NounAttributes;
    try {
      noun = await sequelize.models.Noun.findByPk<NounModel>(req.params.nounId);
    } catch (err) {
      notFound(res, `No such noun with id '${req.params.nounId}'`);
      return;
    }

    const fieldsToCreate: FieldAttributes[] = req.body.fields.map((field) => {
      return {
        ...field,
        nounId,
      };
    });

    const fields: FieldAttributes[] =
      await sequelize.models.Field.bulkCreate<FieldModel>(fieldsToCreate);

    res.json(fields);
  }
);

type FieldToCreate = Omit<FieldAttributes, "nounId">;
interface Params {
  nounId: number;
}
interface RequestBody {
  fields: Array<FieldToCreate>;
}
type ResponseBody = Array<FieldAttributes>;
