'use strict';

const bcrypt = require('bcryptjs');
const Organization = require('../api/models/OrganizationModule');
const EmpOnboarding = require('../api/models/Emp_onboarding');

/**
 * Seed 5 employees in OK_ORG_001 so the chat module can be exercised
 * end-to-end (creating 1:1 threads, group chats, sending messages).
 *
 * Idempotent: re-running the seeder upserts on `personal_email`.
 */
const SEED_EMPLOYEES = [
  {
    emp_name: 'Priya Sharma',
    role: 'employee',
    position: 'Software Engineer',
    personal_email: 'priya@ok.com',
    contact_number: '9000001001',
    gender: 'Female',
    department: 'Engineering',
  },
  {
    emp_name: 'Rahul Verma',
    role: 'employee',
    position: 'QA Engineer',
    personal_email: 'rahul@ok.com',
    contact_number: '9000001002',
    gender: 'Male',
    department: 'Quality',
  },
  {
    emp_name: 'Anita Iyer',
    role: 'manager',
    position: 'Engineering Manager',
    personal_email: 'anita@ok.com',
    contact_number: '9000001003',
    gender: 'Female',
    department: 'Engineering',
  },
  {
    emp_name: 'Karan Mehta',
    role: 'employee',
    position: 'Product Designer',
    personal_email: 'karan@ok.com',
    contact_number: '9000001004',
    gender: 'Male',
    department: 'Design',
  },
  {
    emp_name: 'Sneha Kapoor',
    role: 'employee',
    position: 'HR Executive',
    personal_email: 'sneha@ok.com',
    contact_number: '9000001005',
    gender: 'Female',
    department: 'Human Resources',
  },
];

async function upsertRecord(model, where, values) {
  const existing = await model.findOne({ where });
  if (existing) {
    await existing.update(values);
    return existing;
  }
  return model.create(values);
}

module.exports = {
  async up(queryInterface, Sequelize) {
    // OK_ORG_001 was created by the earlier seeder, but we look it up
    // dynamically so the order of seeders doesn't matter.
    const organization = await Organization.findOne({
      where: { organizationID: 'OK_ORG_001' },
    });
    if (!organization) {
      throw new Error(
        "OK_ORG_001 organization not found. Run the previous seeders first."
      );
    }

    const password = await bcrypt.hash('123456', 10);

    for (const emp of SEED_EMPLOYEES) {
      await upsertRecord(
        EmpOnboarding,
        { personal_email: emp.personal_email },
        {
          emp_name: emp.emp_name,
          calling_name: emp.emp_name,
          role: emp.role,
          position: emp.position,
          department: emp.department,
          gender: emp.gender,
          personal_email: emp.personal_email,
          bussiness_email: emp.personal_email,
          userName: emp.personal_email,
          contact_number: emp.contact_number,
          city: 'Mumbai',
          date_of_birth: '1995-01-01',
          date_of_joining: new Date(),
          permanent_address: 'Mumbai, India',
          current_address: 'Mumbai, India',
          bank_account: '1234567890',
          bank_name: 'Ok Bank',
          IFSC_code: 'OKBK0001234',
          leave_bucket: 12,
          leave_balance: 12,
          orgnaizationId: organization.id,
          isDelete: false,
          employee_type: 'Permanent',
          loan_availability: 0,
          password,
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const emails = SEED_EMPLOYEES.map((e) => e.personal_email);
    await EmpOnboarding.destroy({ where: { personal_email: emails } });
  },
};
