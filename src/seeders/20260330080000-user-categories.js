'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [
      {
        title: 'Brand',
        icon: 'brand-icon', // Replace with actual default icon or leave empty if nullable
        subtitle: 'For businesses and organizations globally.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Influencer/Creator',
        icon: 'creator-icon',
        subtitle: 'For public figures, content creators, and influencers.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Business',
        icon: 'business-icon',
        subtitle: 'For standard businesses needing typical links.',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Assuming we don't want to duplicate if they already exist
    // You could use upsert or just insert if it's a fresh seed
    await queryInterface.bulkInsert('UserCategories', categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('UserCategories', null, {});
  }
};
