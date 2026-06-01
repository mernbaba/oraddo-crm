// config/database.js
// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//     timezone: '+05:30',
//     port: 28005,
//     // port:5432,
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // Adjust this as per your security needs
//       },
//     },
//   }
// );
// const sequelize = new Sequelize(`tridizi`, `postgres`, "soujanya123", {
//   host: `localhost`,
//   dialect: `postgres`,
//     // dialectOptions: {
//     // ssl: {
//     //   require: true,
//     //   rejectUnauthorizeds: false
//     // }
//   })

// config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    timezone: "+05:30",
    // port: 28005,
    port: Number(process.env.DB_PORT || 5432),
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Adjust this as per your security needs
      },
    },
  }
);

module.exports = sequelize;
