const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const TraineeLessonStatus = sequelize.define("TraineeLessonStatus", {
    traineeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lessonId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'running', 'completed'),
        defaultValue: 'pending',
    },
});

module.exports = TraineeLessonStatus;