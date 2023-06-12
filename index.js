const inquirer = require('inquirer');
const db = require('./db/connection');

var employee_tracker = function () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What do you want to do?',
      choices: ['View All Departments', 'View All Jobs', 'View All Employees', 'Add a Department', 'Add a Job', 'Add an Employee', 'Update an Employee Job', 'Log Out']
    }
  ]).then((answers) => {
    if (answers.prompt === 'View All Departments') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.log("Viewing All Departments: ");
        console.table(result);
        employee_tracker();
      });
    } else if (answers.prompt === 'View All Jobs') {
      db.query(`SELECT * FROM job`, (err, result) => {
        if (err) throw err;
        console.log("Viewing All Jobs: ");
        console.table(result);
        employee_tracker();
      });
    } else if (answers.prompt === 'View All Employees') {
      db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) throw err;
        console.log("Viewing All Employees: ");
        console.table(result);
        employee_tracker();
      });
    } else if (answers.prompt === 'Add a Department') {
      inquirer.prompt([
        {
          type: 'input',
          name: 'department',
          message: 'What is the name of the department?',
          validate: departmentInput => {
            if (departmentInput) {
              return true;
            } else {
              console.log('Add A Department!');
              return false;
            }
          }
        }
      ]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.department} to the database.`)
          employee_tracker();
        });
      })
    } else if (answers.prompt === 'Add a Job') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            type: 'input',
            name: 'job',
            message: 'What is the name of the job?',
            validate: jobInput => {
              if (jobInput) {
                return true;
              } else {
                console.log('Add A Job!');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'payRate',
            message: 'What is the pay rate?',
            validate: payRateInput => {
              if (payRateInput) {
                return true;
              } else {
                console.log('Add A Rate of Pay!');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does the job belong to?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].name);
              }
              return array;
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].name === answers.department) {
              var department = result[i];
            }
          }

          db.query(`INSERT INTO job (title, pay_rate, department_id) VALUES (?, ?, ?)`, [answers.job, answers.payRate, department.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.job} to the database.`)
            employee_tracker();
          });
        })
      });
    } else if (answers.prompt === 'Add an Employee') {
      db.query(`SELECT * FROM employee, job`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee\'s first name?',
            validate: firstNameInput => {
              if (firstNameInput) {
                return true;
              } else {
                console.log('Add A First Name!');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'What is the employee\'s last name?',
            validate: lastNameInput => {
              if (lastNameInput) {
                return true;
              } else {
                console.log('Add A Last Name!');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'job',
            message: 'What is the employee\'s job?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          },
          {
            type: 'input',
            name: 'manager',
            message: 'Who is the employee\'s manager?',
            validate: managerInput => {
              if (managerInput) {
                return true;
              } else {
                console.log('Add A Manager!');
                return false;
              }
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.job) {
              var job = result[i];
            }
          }

          db.query(`INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES (?, ?, ?, (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?))`, [answers.firstName, answers.lastName, job.id, answers.manager], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
            employee_tracker();
          });
        })
      });
    } else if (answers.prompt === 'Update an Employee Job') {
      db.query(`SELECT * FROM employee, job`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
          {
            type: 'list',
            name: 'employee',
            message: 'Which employee\'s job do you want to update?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].last_name);
              }
              var employeeArray = [...new Set(array)];
              return employeeArray;
            }
          },
          {
            type: 'list',
            name: 'job',
            message: 'What is their new job?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].last_name === answers.employee) {
              var name = result[i];
            }
          }

          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.job) {
              var job = result[i];
            }
          }

          db.query(`UPDATE employee SET ? WHERE ?`, [{ job_id: job.id }, { last_name: name.last_name }], (err, result) => {
            if (err) throw err;
            console.log(`Updated ${answers.employee}'s job in the database.`)
            employee_tracker();
          });
        })
      });
    } else if (answers.prompt === 'Log Out') {
      db.end();
      console.log("Goodbye");
    }
  })
};

employee_tracker();
