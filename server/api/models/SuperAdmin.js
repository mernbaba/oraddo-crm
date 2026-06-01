const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const SuperAdmin = sequelize.define("SuperAdmin", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "superadmin"
    }
}, {
    tableName: "SuperAdmins"
});

module.exports = SuperAdmin;
