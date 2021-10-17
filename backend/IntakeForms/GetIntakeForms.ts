import { sequelize } from "../DB.js";
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

    // TODO: optimize all of these queries to happen in one DB transaction?

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
            model: sequelize.models.IntakeFormQuestion,
            required: true,
          },
        ],
      });

      console.log({ intakeFormItems });

      res.send(intakeFormItems);
    }
  }
);

interface Params {
  intakeFormId: number;
}
