'use strict';

const bcrypt = require('bcryptjs');
const SuperAdmin = require('../api/models/SuperAdmin');
const OrgSignUp = require('../api/models/organizationSignUp');
const Organization = require('../api/models/OrganizationModule');
const EmpOnboarding = require('../api/models/Emp_onboarding');

async function upsertRecord(model, where, values) {
  const existing = await model.findOne({ where });
  if (existing) {
    await existing.update(values);
    return existing;
  }

  return model.create(values);
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await bcrypt.hash('123456', 10);

    const organization = await upsertRecord(Organization, { organizationID: 'OK_ORG_001' }, {
      organizationID: 'OK_ORG_001',
      companyName: 'OK Organization Pvt Ltd',
      companyType: 'Private Limited',
      industryType: 'Technology',
      companyAddress: 'Ok Campus, Business District',
      companyRegistrationNumber: 'OK-ORG-001',
      founderYear: 2024,
      companySize: '11-50',
      companyWebsite: 'https://ok.example.com',
      No_ofEmployees: 1,
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      phoneNumber: '9000000002',
      userName: 'org@ok.com',
      password,
      email: 'org@ok.com',
      adminName: 'Organization Admin',
      planStartDate: new Date(),
      planExpiryDate: new Date('2099-12-31T00:00:00.000Z'),
      planGracePeriodEnd: new Date('2099-12-31T00:00:00.000Z'),
    });

    await upsertRecord(SuperAdmin, { email: 'admin@ok.com' }, {
      fullName: 'Super Admin',
      email: 'admin@ok.com',
      password,
      role: 'superadmin',
    });

    await upsertRecord(OrgSignUp, { email: 'org@ok.com' }, {
      fullName: 'Organization Admin',
      phoneNumber: '9000000002',
      email: 'org@ok.com',
      password,
      title: 'Organization Admin',
      companyName: 'OK Organization Pvt Ltd',
      selectedPlan: 'Premium',
      status: 'Converted',
    });

    await upsertRecord(EmpOnboarding, { personal_email: 'employee@ok.com' }, {
      emp_name: 'Ok Employee',
      calling_name: 'Ok Employee',
      role: 'employee',
      password,
      date_of_birth: '1995-01-01',
      date_of_joining: new Date(),
      city: 'Mumbai',
      contact_number: '9000000003',
      permanent_address: 'Ok Employee Address',
      current_address: 'Ok Employee Address',
      personal_email: 'employee@ok.com',
      bussiness_email: 'employee@ok.com',
      userName: 'employee@ok.com',
      bank_account: '1234567890',
      bank_name: 'Ok Bank',
      IFSC_code: 'OKBK0001234',
      leave_bucket: 12,
      leave_balance: 12,
      orgnaizationId: organization.id,
      isDelete: false,
      employee_type: 'Permanent',
      gender: 'Others',
      position: 'Employee',
      loan_availability: 0,
      department: 'General',
    });
  },

  async down(queryInterface, Sequelize) {
    await EmpOnboarding.destroy({ where: { personal_email: 'employee@ok.com' } });
    await OrgSignUp.destroy({ where: { email: 'org@ok.com' } });
    await SuperAdmin.destroy({ where: { email: 'admin@ok.com' } });
    await Organization.destroy({ where: { organizationID: 'OK_ORG_001' } });
  },
};
