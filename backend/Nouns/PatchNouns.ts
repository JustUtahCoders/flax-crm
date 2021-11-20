import { router } from "../Router.js";
import { body, param, validationResult } from "express-validator";
import {
  invalidRequest,
  notFound,
  successNoContent,
} from "../Utils/EndpointResponses.js";
import { NounAttributes, NounModel } from "../DB/models/noun.js";

router.patch<Params, ResponseBody, RequestBody>(
  "/api/nouns/:nounId",
  param("nounId").isInt().toInt(),
  body("slug").isString(),
  body("friendlyName").isString(),
  body("parentId").isNumeric(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { slug, friendlyName, parentId } = req.body;
    const toUpdate = {
      ...(slug !== undefined && { slug }),
      ...(friendlyName !== undefined && { friendlyName }),
      ...(parentId !== undefined && { parentId }),
    };

    const [numUpdated] = await NounModel.update(toUpdate, {
      where: {
        id: req.params.nounId,
      },
    });

    if (numUpdated === 0) {
      notFound(res, `No such noun with id '${req.params.nounId}'`);
    } else {
      successNoContent(res);
    }
  }
);

interface Params {
  nounId: number;
}

type ResponseBody = void;

type RequestBody = NounAttributes;
