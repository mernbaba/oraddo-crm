const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Final_Settlement = sequelize.define("Final_Settlement",{
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    emp_onboarding_id:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
    leave_balance_amount:{
        type: DataTypes.FLOAT,
        allowNull:true
    },
    incentives_amount:{
        type: DataTypes.FLOAT,
        allowNull:true
    },
    total_amount:{
        type:DataTypes.FLOAT,
        allowNull:true
    },
    settlement_status:{
        type: DataTypes.ENUM("Approved","Declained"),
        allowNull:false
    },
    organizationID:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
})
module.exports = Final_Settlement