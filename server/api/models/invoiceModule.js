const sequelize = require("../../config/database");
const {DataTypes} = require("sequelize");



const invoiveModulePoints = sequelize.define("invoiceModule",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    name:{  
        type:DataTypes.STRING,
        allowNull:true
    },
    content:{
        type:DataTypes.ARRAY(DataTypes.JSONB),
        allowNull:true
    },
    organizationID:{
        type:DataTypes.INTEGER,
        allowNull:true,
    }
});

module.exports = invoiveModulePoints;