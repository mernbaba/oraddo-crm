const sequelize = require("../../config/database");
const {DataTypes}=require("sequelize");

const ExpensesMangementCreation = sequelize.define("expensesMangementCreation",{
    moduleName:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    purchasingMode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    dateOfPurchasing:{
        type:DataTypes.DATE,
        allowNull:false
    },
    price:{
        type:DataTypes.STRING,
        allowNull:false
    },
    paymentMode:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    planMode:{
        type:DataTypes.STRING,
        allowNull:false
    },
    monthYear:{
        type:DataTypes.STRING,
        allowNull:false
    },
    organizationID:{
        type:DataTypes.INTEGER,
        allowNull:true
    },
});

module.exports = ExpensesMangementCreation;