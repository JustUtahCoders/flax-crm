import { body, checkSchema, validationResult } from "express-validator";
import { ModelCtor } from "sequelize/lib/model.js";
import { NounModel } from "../../models/noun.js";
import { sequelize } from "../DB.js";
import { router } from "../Router.js";
import { invalidRequest } from "../Utils/EndpointResponses.js";

router.post(
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

    const Nouns: ModelCtor<NounModel> = sequelize.models.Noun;

    const { count: numDuplicates } = await Nouns.findAndCountAll({
      where: {
        tableName,
      },
    });

    if (numDuplicates > 0) {
      return res.status(400).send({
        error: `A noun with tableName ${tableName} already exists`,
      });
    }

    const newNoun = await sequelize.models.Noun.create({
      tableName,
      slug,
      friendlyName,
      parentId,
    });
    if (newNoun) {
      res.status(201).send(newNoun);
    } else {
      res.status(500);
    }
  }
);
