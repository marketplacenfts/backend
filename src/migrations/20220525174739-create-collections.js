'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('collections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING
      },
      abi: {
        type: Sequelize.JSON
      },
      description: {
        type: Sequelize.TEXT
      },
      name: {
        type: Sequelize.STRING
      },
      autor: {
        type: Sequelize.STRING
      },
      sold: {
        type: Sequelize.INTEGER
      },
      red: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      url: {
        type: Sequelize.STRING
      },
    maxSupply: {
      type: Sequelize.INTEGER
    },
    tipo: {
      type: Sequelize.STRING
    },
    avatar: {
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
    await queryInterface.dropTable('collections');
  }
};