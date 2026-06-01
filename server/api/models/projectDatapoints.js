const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const ProjectDataPoints = sequelize.define("ProjectDataPoints", {
    ProjectId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Projects',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      DatapointId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Datapoints',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      datapointsorder: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isRequired: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
});

module.exports = ProjectDataPoints;