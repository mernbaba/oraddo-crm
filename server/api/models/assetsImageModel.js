const {DataTypes} = require("sequelize")
const sequelize = require("../../config/database")

const figmaAssetsImages = sequelize.define("assetsImages",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    image_URL:{
        type:DataTypes.STRING,
        allowNull:true,
    },

});
    module.exports = figmaAssetsImages;