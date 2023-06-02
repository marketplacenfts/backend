'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class auctions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  auctions.init({
    auctionId: DataTypes.INTEGER,
    tokenAddress : DataTypes.STRING,
    tokenId: DataTypes.STRING,
    seller: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    duration: DataTypes.INTEGER,
    maxBid: DataTypes.DOUBLE,
    userMaxBid: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'auctions',
  });
  return auctions;
};