import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import {
  invalidRequest,
  notFound,
  successNoContent,
} from "../Utils/EndpointResponses.js";
import { NounModel } from "../DB/models/Noun.js";

router.delete<Params, ResponseBody, RequestBody>(
  "/api/nouns/:nounId",
  param("nounId").isInt().toInt(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const numDeleted = await NounModel.destroy({
      where: {
        id: req.params.nounId,
      },
    });
    if (numDeleted === 0) {
      notFound(
        res,
        `Could not delete noun - no such noun with id '${req.params.nounId}'`
      );
    } else {
      successNoContent(res);
    }
  }
);

interface Params {
  nounId: number;
}

type ResponseBody = void;

type RequestBody = void;
