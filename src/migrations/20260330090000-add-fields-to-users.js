'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'username', {
      type: Sequelize.STRING,
      unique: true,
      after: 'email'
    });
    await queryInterface.addColumn('Users', 'verificationToken', {
      type: Sequelize.TEXT,
      after: 'username'
    });
    await queryInterface.addColumn('Users', 'onBoarded', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: 'verificationToken'
    });
    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.TEXT,
      after: 'onBoarded'
    });
    await queryInterface.addColumn('Users', 'UserCategoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'UserCategories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      after: 'bio'
    });
    
    // Also ensuring unique on email since it wasn't there in the initial migration
    await queryInterface.addIndex('Users', ['email'], {
        unique: true,
        name: 'users_email_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('Users', 'users_email_unique');
    await queryInterface.removeColumn('Users', 'UserCategoryId');
    await queryInterface.removeColumn('Users', 'bio');
    await queryInterface.removeColumn('Users', 'onBoarded');
    await queryInterface.removeColumn('Users', 'verificationToken');
    await queryInterface.removeColumn('Users', 'username');
  }
};
