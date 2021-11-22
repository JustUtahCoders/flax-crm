import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { Field, FieldModel } from "../DB/models/Field.js";
import { invalidRequest, notFound } from "../Utils/EndpointResponses.js";

router.get<Params, ResponseBody, RequestBody>(
  "/api/nouns/:nounId/fields",
  param("nounId").isInt().toInt(),

  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { nounId } = req.params;

    let fields: FieldModel[];

    try {
      fields = await FieldModel.findAll<FieldModel>({
        where: {
          nounId,
        },
      });
    } catch (err) {
      console.error(err);
      notFound(res, `No such noun with id '${nounId}'`);
      return;
    }

    res.status(200).json({ fields });
  }
);

interface Params {
  nounId: number;
}

interface ResponseBody {
  fields: FieldModel[];
}

type RequestBody = void;
