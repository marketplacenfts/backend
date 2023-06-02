'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('auctions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      auctionId : {
        type: Sequelize.INTEGER
      },
      tokenAddress : {
        type: Sequelize.STRING
      },
      tokenId : {
        type: Sequelize.STRING
      },
      seller: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      duration: {
        type: Sequelize.INTEGER
      },
      maxBid: {
        type: Sequelize.DOUBLE
      },
      userMaxBid: {
        type: Sequelize.STRING
      },
      isActive: {
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
    await queryInterface.dropTable('auctions');
  }
};