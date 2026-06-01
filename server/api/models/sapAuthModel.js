const {DataTypes} = require('sequelize');
const sequalize = require('../../config/database')

const SapEmployee =  sequalize.define('SapEmployee',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    email_id:{
        type:DataTypes.STRING,
        allowNull:false
    },
    manager_name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    }
    
});
module.exports = SapEmployee;