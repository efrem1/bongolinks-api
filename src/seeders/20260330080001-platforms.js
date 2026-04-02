'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const platforms = [
      { name: 'Instagram', logo: 'instagram.webp', color: '#E4405F', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Facebook', logo: 'facebook.svg', color: '#1877F2', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Twitter (X)', logo: 'x.svg', color: '#000000', createdAt: new Date(), updatedAt: new Date() },
      { name: 'YouTube', logo: 'youtube.svg', color: '#FF0000', createdAt: new Date(), updatedAt: new Date() },
      { name: 'TikTok', logo: 'tiktok.png', color: '#000000', createdAt: new Date(), updatedAt: new Date() },
      { name: 'WhatsApp', logo: 'whatsapp.png', color: '#25D366', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Spotify', logo: 'spotify.png', color: '#1DB954', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Apple Music', logo: 'apple-music.jpeg', color: '#FC3C44', createdAt: new Date(), updatedAt: new Date() },
      { name: 'SoundCloud', logo: 'sound-cloud.svg', color: '#FF3300', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Patreon', logo: 'patreon.png', color: '#FF424D', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Threads', logo: 'threads.png', color: '#000000', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Twitch', logo: 'twitch.jpg', color: '#9146FF', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Pinterest', logo: 'pininterest.png', color: '#BD081C', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Gmail', logo: 'gmail.png', color: '#D14836', createdAt: new Date(), updatedAt: new Date() },
      { name: 'JamiiForum', logo: 'jamii-forum.jpeg', color: '#E11D48', createdAt: new Date(), updatedAt: new Date() }
    ];

    // Truncate first to avoid duplicates or just insert
    // Using TRUNCATE might fail if there are FKs, so we use delete
    await queryInterface.bulkDelete('Platforms', null, {});
    await queryInterface.bulkInsert('Platforms', platforms, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Platforms', null, {});
  }
};
