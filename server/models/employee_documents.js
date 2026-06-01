// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class employee_documents extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   employee_documents.init({
//     form_type: DataTypes.STRING,
//     file_key: DataTypes.STRING,
//     file_url: DataTypes.STRING,
//     uploaded_by: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'employee_documents',
//   });
//   return employee_documents;
// };