const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");


const Lessons = sequelize.define("Lesson_Module", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lesson_description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reward_points: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    organizationID:{
        type:DataTypes.INTEGER,
        allowNull:true,
    }
    //   lesson_status: {
    //     type: DataTypes.ENUM("InComplete", "Completed", "Running"),
    //     allowNull: true,
    //   },
    //   team_lead_status: {
    //     type: DataTypes.ENUM("Approved", "Declined"),
    //     allowNull: true,
    //   },  
});

module.exports = Lessons;
