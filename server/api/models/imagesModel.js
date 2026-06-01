const {DataTypes} = require("sequelize")
const sequelize = require("../../config/database")

const figmaImages = sequelize.define("MainImages",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    image_URL:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    MainImageId:{
        type:DataTypes.INTEGER,
        allowNull:true,
    }
});
    module.exports = figmaImages;