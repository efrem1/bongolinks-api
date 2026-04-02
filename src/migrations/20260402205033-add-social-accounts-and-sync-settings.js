'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('SocialAccounts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      UserId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      provider: { type: Sequelize.STRING, allowNull: false },
      accessToken: { type: Sequelize.TEXT, allowNull: false },
      refreshToken: { type: Sequelize.TEXT, allowNull: true },
      expiresAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    await queryInterface.addColumn('Users', 'autoSyncSocial', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('SocialAccounts');
    await queryInterface.removeColumn('Users', 'autoSyncSocial');
  }
};
