
const { DataTypes } = require("sequelize")
const sequalize = require("../../config/database")

const Clients = sequalize.define("Clients",{
    id:{
        type : DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    company_name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    services:{
        type:DataTypes.STRING,
        allowNull:true
    },
    image_url:{
        type:DataTypes.STRING,
        allowNull:true
    },
    location:{
        type:DataTypes.STRING,
        allowNull:true
    },
    organizationID:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
})

module.exports = Clients