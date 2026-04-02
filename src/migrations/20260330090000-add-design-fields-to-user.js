'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'theme', {
      type: Sequelize.STRING,
      defaultValue: 'modern-glass'
    });
    await queryInterface.addColumn('Users', 'bgColor', {
      type: Sequelize.STRING,
      defaultValue: '#030712'
    });
    await queryInterface.addColumn('Users', 'accentColor', {
      type: Sequelize.STRING,
      defaultValue: '#8B5CF6'
    });
    await queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.TEXT,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'coverImage', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'theme');
    await queryInterface.removeColumn('Users', 'bgColor');
    await queryInterface.removeColumn('Users', 'accentColor');
    await queryInterface.removeColumn('Users', 'avatar');
    await queryInterface.removeColumn('Users', 'coverImage');
  }
};
