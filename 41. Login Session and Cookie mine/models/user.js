'use strict';
var bcrypt = require('bcrypt');

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
  }
  User.init({
    id:{
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
  },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
  },
    password: {
      type: DataTypes.STRING,
      allowNull: false
  }
  }, {
    sequelize,
    modelName: 'User',
  });
  
  User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  });
    
   
  User.prototype.validPassword = function(password) {
          return bcrypt.compareSync(password, this.password);
        }; 
  
  // create all the defined tables in the specified database.
  sequelize.sync()
      .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
      .catch(error => console.log('This error occured', error));


  return User;
};