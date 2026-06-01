const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const OrgSignUp = sequelize.define("orgSignUp", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selectedPlan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("Converted", "Dead", "Processing"),
        allowNull: true,
    },
    // confirmPassword:{
    //     type:DataTypes.STRING,
    //     allowNull:false
    // }
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selectedPlan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("Converted", "Dead", "Processing"),
        allowNull: true,
      },
});

module.exports = OrgSignUp;