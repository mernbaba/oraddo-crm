const {DataTypes, INTEGER} = require('sequelize');
const sequelize = require('../../config/database');


const praposalService = sequelize.define('praposalServices',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // name: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    Services: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
    },
    type:{
        type:DataTypes.STRING,
        allowNull:true
    },
    organizationID:{
        type: DataTypes.INTEGER,
        allowNull:true,
    },
    proposal_Id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
})


module.exports = praposalService;