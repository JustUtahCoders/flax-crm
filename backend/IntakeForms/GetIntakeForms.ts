import { sequelize } from "../DB.js";
import s from "sequelize";
import { router } from "../Router.js";
import { param, validationResult } from "express-validator";
import { invalidRequest, notFound } from "../Utils/EndpointResponses.js";

router.get("/api/intake-forms", async (req, res) => {
  const intakeForms = await sequelize.models.IntakeForm.findAll();
  res.send({
    intakeForms,
  });
});

router.get<Params>(
  "/api/intake-forms/:intakeFormId",
  param("intakeFormId").isInt().toInt(),
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return invalidRequest(res, validationErrors);
    }

    const { intakeFormId } = req.params;
    const intakeForm = await sequelize.models.IntakeForm.findByPk(intakeFormId);

    if (intakeForm === null) {
      notFound(res, `No such intake form with id '${intakeFormId}'`);
    } else {
      const intakeFormItems = await sequelize.models.IntakeFormItem.findAll({
        where: {
          intakeFormId,
        },
        include: [
          {
            association: "pageChildren",
            required: true,
            where: {
              // Only include sections or items with no sections
              [s.Op.or]: [{ sectionId: null }, { type: "section" }],
            },
            include: [
              {
                association: "sectionChildren",
                required: false,
                include: [
                  {
                    model: sequelize.models.IntakeFormQuestion,
                    required: false,
                  },
                  {
                    model: sequelize.models.Field,
                    required: false,
                  },
                ],
                order: ["orderIndex"],
              },
              {
                model: sequelize.models.IntakeFormQuestion,
                required: false,
              },
              {
                model: sequelize.models.Field,
                required: false,
              },
            ],
            order: ["orderIndex"],
          },
        ],
        order: ["orderIndex"],
      });

      res.send(intakeFormItems);
    }
  }
);

interface Params {
  intakeFormId: number;
}
