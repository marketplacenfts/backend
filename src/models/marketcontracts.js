'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class marketContracts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  marketContracts.init({
    chain: DataTypes.INTEGER,
    address: DataTypes.STRING,
    abi: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'marketContracts',
  });
  return marketContracts;
};