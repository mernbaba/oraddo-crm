const {DataTypes} = require("sequelize");
const sequelize = require("../../config/database");


const PremiumPlans = sequelize.define("PremiumPlans",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    planName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    duration:{
        type:DataTypes.STRING,
        allowNull:false
    },
    price:{
        type:DataTypes.STRING,
        allowNull:false
    },
    employeeLimit:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    subscription:{
        type:DataTypes.STRING,
        allowNull:true
    },
    total:{
    type:DataTypes.FLOAT,
    allowNull:true
  },
  isActive:{
    type:DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true
  }
});

module.exports = PremiumPlans;