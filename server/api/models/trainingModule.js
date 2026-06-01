const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const modules = sequelize.define('Training_Module', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    document_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    team_lead: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    organizationID:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
});

module.exports = modules;