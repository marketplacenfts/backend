'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nftBuyHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  nftBuyHistory.init({
    collection: DataTypes.STRING,
    tokenId: DataTypes.STRING,
    seller: DataTypes.STRING,
    buyer: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    txid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'nftBuyHistory',
  });
  return nftBuyHistory;
};