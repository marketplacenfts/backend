'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('nfts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tokenId: {
        type: Sequelize.STRING
      },
      nftcontract: {
        type: Sequelize.STRING
      },
      seller: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      owner: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      sold: {
        type: Sequelize.BOOLEAN
      },
      url: {
        type: Sequelize.TEXT
      },
      isItem: {
        type: Sequelize.BOOLEAN
      },
      nftType: {
        type: Sequelize.STRING
      },
      red: {
        type: Sequelize.STRING
      },
      likes: {
        type: Sequelize.INTEGER
      },
      banned: {
        type: Sequelize.BOOLEAN
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
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('nfts');
  }
};