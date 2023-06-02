'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    publicAddress: { type: DataTypes.STRING, unique: true },
    username: { type: DataTypes.STRING, unique: true },
    avatar: DataTypes.STRING,
    about: DataTypes.TEXT,
    nonce: DataTypes.INTEGER,
    role: DataTypes.STRING,
    status: DataTypes.STRING,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    email: DataTypes.STRING,
    soldAmount: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};