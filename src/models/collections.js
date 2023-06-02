'use strict';
const { INTEGER } = require('sequelize');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class collections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  collections.init({
    address: DataTypes.STRING,
    abi: DataTypes.JSON,
    description: DataTypes.TEXT,
    name: DataTypes.STRING,
    autor: DataTypes.STRING,
    sold: DataTypes.INTEGER,
    red: DataTypes.STRING,
    image: DataTypes.STRING,
    avatar: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    url: DataTypes.STRING,
    maxSupply: DataTypes.INTEGER,
    tipo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'collections',
  });
  return collections;
};