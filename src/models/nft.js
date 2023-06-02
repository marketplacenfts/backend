'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class nft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  nft.init({
    tokenId: DataTypes.STRING,
    nftcontract: DataTypes.STRING,
    seller: DataTypes.STRING,
    owner: DataTypes.STRING,
    name: DataTypes.STRING,
    price: DataTypes.DOUBLE,
    sold: DataTypes.BOOLEAN,
    url: DataTypes.TEXT,
    isItem: DataTypes.BOOLEAN,
    nftType: DataTypes.STRING,
    red: DataTypes.STRING,
    likes: DataTypes.INTEGER,
    banned: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'nft',
  });
  return nft;
};