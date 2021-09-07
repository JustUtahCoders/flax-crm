"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Nouns", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tableName: {
        type: Sequelize.STRING,
      },
      slug: {
        type: Sequelize.STRING,
      },
      friendlyName: {
        type: Sequelize.STRING,
      },
      parentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Nouns",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Nouns");
  },
};
