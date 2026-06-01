const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const EmpNotes = require("./notes");
const Employee = require("./Emp_onboarding");  // Assuming you have an Employee model

const SharedNotes = sequelize.define("shared_notes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  noteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: EmpNotes,
      key: "id",
    },
  },
  sharedWithEmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Employee,
      key: "id",
    },
  },
  sharedByEmployeeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Employee,
      key: "id",
    },
  },
  sharedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

// Associations
EmpNotes.hasMany(SharedNotes, { foreignKey: "noteId" });
SharedNotes.belongsTo(EmpNotes, { foreignKey: "noteId" });

Employee.hasMany(SharedNotes, { foreignKey: "sharedByEmployeeId", as: "sharedByEmployee" });
SharedNotes.belongsTo(Employee, { foreignKey: "sharedByEmployeeId", as: "sharedByEmployee" });

Employee.hasMany(SharedNotes, { foreignKey: "sharedWithEmployeeId", as: "sharedWithEmployee" });
SharedNotes.belongsTo(Employee, { foreignKey: "sharedWithEmployeeId", as: "sharedWithEmployee" });

module.exports = SharedNotes;
