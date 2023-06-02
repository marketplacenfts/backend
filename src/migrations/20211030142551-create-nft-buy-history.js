'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('nftBuyHistories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      collection: {
        type: Sequelize.STRING
      },
      tokenId: {
        type: Sequelize.STRING
      },
      seller: {
        type: Sequelize.STRING
      },
      buyer: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DOUBLE
      },
      txid: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('nftBuyHistories');
  }
};