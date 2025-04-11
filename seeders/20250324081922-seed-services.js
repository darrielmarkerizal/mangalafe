"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Services",
      [
        {
          name: "PKKPR & PKKPRL",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { name: "AMDAL & DELH", createdAt: new Date(), updatedAt: new Date() },
        {
          name: "UKL-UPL & DPLH",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Laporan Pemantauan dan Pengelolaan Lingkungan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { name: "PERTEK", createdAt: new Date(), updatedAt: new Date() },
        { name: "LARAP", createdAt: new Date(), updatedAt: new Date() },
        {
          name: "Studi dan Kajian Bidang Transportasi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Jasa Survey Lingkungan",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Services", null, {});
  },
};
