'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 1. Plans
    await queryInterface.createTable('Plans', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, allowNull: false },
      googlePayPriceId: { type: Sequelize.STRING, allowNull: true },
      type: { type: Sequelize.ENUM('free', 'premium'), defaultValue: 'free', allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 2. Features
    await queryInterface.createTable('Features', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      name: { type: Sequelize.STRING, allowNull: false },
      key: { type: Sequelize.STRING, unique: true, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 3. PlanFeatures (Join table)
    await queryInterface.createTable('PlanFeatures', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      PlanId: { type: Sequelize.INTEGER, references: { model: 'Plans', key: 'id' }, onDelete: 'CASCADE' },
      FeatureId: { type: Sequelize.INTEGER, references: { model: 'Features', key: 'id' }, onDelete: 'CASCADE' },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 4. Subscriptions
    await queryInterface.createTable('Subscriptions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      UserId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      PlanId: { type: Sequelize.INTEGER, references: { model: 'Plans', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: Sequelize.STRING, defaultValue: 'active', allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 5. LinkClicks (Analytics)
    await queryInterface.createTable('LinkClicks', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      LinkId: { type: Sequelize.INTEGER, references: { model: 'Links', key: 'id' }, onDelete: 'CASCADE' },
      UserId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      ip: { type: Sequelize.STRING, allowNull: true },
      userAgent: { type: Sequelize.STRING, allowNull: true },
      referrer: { type: Sequelize.STRING, allowNull: true },
      country: { type: Sequelize.STRING, allowNull: true },
      timestamp: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 6. DigitalProducts
    await queryInterface.createTable('DigitalProducts', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      UserId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      fileUrl: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 7. Orders
    await queryInterface.createTable('Orders', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      UserId: { type: Sequelize.INTEGER, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      DigitalProductId: { type: Sequelize.INTEGER, references: { model: 'DigitalProducts', key: 'id' }, onDelete: 'CASCADE' },
      status: { type: Sequelize.STRING, defaultValue: 'pending', allowNull: false },
      paymentIntentId: { type: Sequelize.STRING, allowNull: true },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });

    // 8. Add PlanId to Users for quick reference
    await queryInterface.addColumn('Users', 'isVerified', { type: Sequelize.BOOLEAN, defaultValue: false });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
    await queryInterface.dropTable('DigitalProducts');
    await queryInterface.dropTable('LinkClicks');
    await queryInterface.dropTable('Subscriptions');
    await queryInterface.dropTable('PlanFeatures');
    await queryInterface.dropTable('Features');
    await queryInterface.dropTable('Plans');
    await queryInterface.removeColumn('Users', 'isVerified');
  }
};
