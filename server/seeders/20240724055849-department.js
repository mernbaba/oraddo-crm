'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('departments',[
      {
        name: 'Management',
        createdAt: new Date(),
        updatedAt: new Date(),
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
        name: 'Technical',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Lead Generation',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('departments', {
      name: [
        'Management',
        'HR',
        'Marketing',
        'Business Development',
        'Technical',
        'Lead Generation',
      ],
    });
  }
};
