'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'googleId', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
    await queryInterface.addColumn('Users', 'fontFamily', {
      type: Sequelize.STRING,
      defaultValue: 'inter'
    });
    await queryInterface.addColumn('Users', 'buttonStyle', {
      type: Sequelize.STRING,
      defaultValue: 'rounded-md'
    });
    await queryInterface.addColumn('Users', 'buttonShadow', {
      type: Sequelize.STRING,
      defaultValue: 'none'
    });
    await queryInterface.addColumn('Links', 'isSocial', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'googleId');
    await queryInterface.removeColumn('Users', 'fontFamily');
    await queryInterface.removeColumn('Users', 'buttonStyle');
    await queryInterface.removeColumn('Users', 'buttonShadow');
    await queryInterface.removeColumn('Links', 'isSocial');
  }
};
