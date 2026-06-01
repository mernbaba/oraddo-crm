'use strict';

const { DATE } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  return queryInterface.bulkInsert('dep_modules',[
    {
      name:'Dashboard',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Human_Resources',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Marketing',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Business Development',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Finance',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Project_Management',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Lead_Management',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Notes',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Training&Learning',
      createdAt: new Date(),
      updatedAt: new Date(),
    },

  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
