import { body, checkSchema, validationResult } from "express-validator";
import { NounModel } from "../DB/models/noun.js";
import { router } from "../Router.js";
import {
  created,
  invalidRequest,
  serverApiError,
} from "../Utils/EndpointResponses.js";

router.post<Params, ResponseBody, RequestBody>(
  "/api/nouns",
  body("tableName").isString().notEmpty().trim(),
  body("slug").isString().notEmpty().trim(),
  body("friendlyName").isString().notEmpty().trim(),
  body("parentId").isInt().optional({ nullable: true }),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { tableName, slug, friendlyName, parentId } = req.body;

    const { count: numDuplicates } = await NounModel.findAndCountAll({
      where: {
        tableName,
      },
    });

    if (numDuplicates > 0) {
      return invalidRequest(
        res,
        `A noun with tableName ${tableName} already exists`
      );
    }

    const newNoun = await NounModel.create({
      tableName,
      slug,
      friendlyName,
      parentId,
    });

    if (newNoun) {
      return created(res, newNoun);
    } else {
      return serverApiError(res, "Could not create noun");
    }
  }
);

interface Params {}

type ResponseBody = NounModel;

interface RequestBody {
  tableName: string;
  slug: string;
  friendlyName: string;
  parentId: number;
}
