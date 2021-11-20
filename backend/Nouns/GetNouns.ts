import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { invalidRequest, notFound } from "../Utils/EndpointResponses.js";
import { NounModel } from "../DB/models/noun.js";

router.get<void, GetAllNounsResponseBody>("/api/nouns", async (req, res) => {
  const nouns = await NounModel.findAll();
  res.send({
    nouns,
  });
});

router.get<GetOneNounParams, NounModel>(
  "/api/nouns/:nounId",
  param("nounId").isInt().toInt(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { nounId } = req.params;
    const noun = await NounModel.findByPk(nounId);
    if (noun === null) {
      notFound(res, `No such noun with id '${nounId}'`);
    } else {
      res.send(noun);
    }
  }
);

interface GetOneNounParams {
  nounId: number;
}

interface GetAllNounsResponseBody {
  nouns: NounModel[];
}
