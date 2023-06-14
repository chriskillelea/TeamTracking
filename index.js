const inquirer = require('inquirer');
const db = require('./db/connection');

const employee_tracker = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What do you want to do?',
      choices: ['View Departments', 'View Jobs', 'View Employees', 'Add a Department', 'Add a Job', 'Add an Employee', 'Log Out']
    }
  ])
};

employee_tracker();
