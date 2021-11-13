"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "IntakeFormItems",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        type: {
          allowNull: false,
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        intakeFormId: {
          type: Sequelize.INTEGER,
          references: {
            model: "IntakeForms",
            key: "id",
          },
        },
        fieldId: {
          type: Sequelize.INTEGER,
          references: {
            model: "Fields",
            key: "id",
          },
        },
        intakeFormQuestionId: {
          type: Sequelize.INTEGER,
          references: {
            model: "IntakeFormQuestions",
            key: "id",
          },
        },
        pageId: {
          type: Sequelize.INTEGER,
          references: {
            model: "IntakeFormItems",
            key: "id",
          },
        },
        sectionId: {
          type: Sequelize.INTEGER,
          references: {
            model: "IntakeFormItems",
            key: "id",
          },
        },
        textContent: {
          type: Sequelize.STRING,
        },
        orderIndex: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
      },
      {
        uniqueKeys: {
          orderIndexUnique: {
            fields: ["pageId", "sectionId", "orderIndex"],
            customIndex: true,
          },
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("IntakeFormItems");
  },
};
