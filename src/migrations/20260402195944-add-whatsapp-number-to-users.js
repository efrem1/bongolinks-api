'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'whatsappNumber', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
      after: 'email'
    });

    await queryInterface.createTable('VerificationCodes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      identifier: {
        type: Sequelize.STRING,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('VerificationCodes', ['identifier', 'code']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('VerificationCodes');
    await queryInterface.removeColumn('Users', 'whatsappNumber');
  }
};
