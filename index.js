const inquirer = require('inquirer');
const db = require('./db/connection');

const employee_tracker = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What do you want to do?',
      choices: ['View Employees', 'View Departments', 'View Jobs', 'Add an Employee', 'Add a Department', 'Add a Job', 'Log-Out']
    }
  ])
};

employee_tracker();

