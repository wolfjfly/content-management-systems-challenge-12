const inquirer = require('inquirer')
const mysql = require('mysql2');
const dbConfig = require('./config/config')
require('console.table');


const db = mysql.createConnection(dbConfig,
    console.log(` +++ Connected to ${process.env.DB_NAME}`))

const addDept= {
    type: "input",
    name: "new_department",
    message: "What is the name of the department you would like to add?",
};

const addDepartment = () => {
    return inquirer.prompt(addDept).then((answer) => {
        const deptSql =
            "INSERT INTO employee_db.department (name) VALUES('" +answer.new_department +"')";
        db.query(deptSql, function (err, results) {
            if (err) {
                console.log(err);
            }
            console.table(results);
            selectionMenu();
        });
    });
};

const getAllDepts = () => {
    return new Promise((resolve, reject) => {
        var departmentChoices;
        db.query("SELECT * FROM employee_db.department", function (err, results) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            departmentChoices = results.map((department) => {
                return { name: department.name, value: department.id };
            });
            resolve(departmentChoices);
        });
    });
};

const addRole = () => {
    getAllDepts().then((departmentChoices) => {
        return inquirer
            .prompt([
                {
                    type: "input",
                    name: "new_role",
                    message: "What is the name of the role you would like to add?",
                },
                {
                    type: "list",
                    name: "role_department",
                    message: "For which department is the new role under?",
                    choices: departmentChoices,
                },
                {
                    type: "input",
                    name: "role_salary",
                    message: "What is the salary of the role?",
                },
            ])
            .then((answers) => {
                const role = [
                    `'${answers.new_role}'`,
                    answers.role_department,
                    parseFloat(answers.role_salary),
                ].join(",");
                const roleSql =
                    "INSERT INTO role (title, department_id, salary) VALUES(" + role +")";
                db.query(roleSql, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    console.table(results);
                    selectionMenu();
                });
            });
    });
};

const getAllManagers = () => {
    return new Promise((resolve, reject) => {
        var managerChoices;
        db.query(
            "SELECT first_name, id FROM employee",
            function (err, results) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                // console.table(results);
                managerChoices = results.map((manager) => {
                    return { name: manager.first_name, value: manager.id };
                });
                resolve(managerChoices);
            }
        );
    });
};

const getAllRoles = () => {
    return new Promise((resolve, reject) => {
        var roleChoices;
        db.query("SELECT title, id FROM role", function (err, results) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            // console.table(results);
            roleChoices = results.map((role) => {
                return { name: role.title, value: role.id };
            });
            resolve(roleChoices);
        });
    });
};

const addEmployee = () => {
    var addEmployeeAnswers = {};
    getAllRoles().then((roleChoices) => {
        return inquirer
            .prompt([
                {
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?",
                    default: "First Name",
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?",
                    default: "Last Name",
                },
                {
                    type: "list",
                    name: "employee_role",
                    message: "What is the employee's role?",
                    choices: roleChoices,
                    default: "Employee Role",
                },
            ])
            .then((answers) => {
                addEmployeeAnswers.first_name = answers.first_name;
                addEmployeeAnswers.last_name = answers.last_name;
                addEmployeeAnswers.employee_role = answers.employee_role;
                getAllManagers()
                    .then((managerChoices) => {
                        return inquirer
                            .prompt([
                                {
                                    type: "list",
                                    name: "manager",
                                    message: "Who is the employee's manager?",
                                    choices: managerChoices,
                                },
                            ])
                            .then((answers) => {
                                return answers;
                            });
                    })
                    .then((answers) => {
                        const employee = [
                            `'${addEmployeeAnswers.first_name}',
            '${addEmployeeAnswers.last_name}',
            '${addEmployeeAnswers.employee_role}',
            '${answers.manager}',`,
                        ];
                        const employeeSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES("${addEmployeeAnswers.first_name}","${addEmployeeAnswers.last_name}", "${addEmployeeAnswers.employee_role}", "${answers.manager}");`;
                        db.query(employeeSql, function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            console.table(results);
                            selectionMenu();
                        });
                    });
            });
    });
};
const firstQuestion = [
    {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee'],
    }]

function selectionMenu() {
    return inquirer.prompt(firstQuestion).then((answer) => {
        switch (answer.choice) {
            case "view all departments":
                db.query("SELECT * FROM employee_db.department", function (err, results) {
                    console.table(results);
                    selectionMenu();
                });
                break;
            case "view all roles":
                db.query("SELECT * FROM employee_db.role", function (err, results) {
                    console.table(results);
                    selectionMenu();
                });
                break;
            case "view all employees":
                db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ' , manager.last_name) AS manager FROM employee employee INNER JOIN role role ON employee.role_id= role.id INNER JOIN department department ON role.department_id= department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.last_name`, function (err, results) {
                    console.table(results);
                    selectionMenu();
                });
                break;
            case "add a department":
                addDepartment();
                break;
            case "add a role":
                addRole();
                break;
            case "add an employee":
                addEmployee();
                break;
            default:
        }
    });

} selectionMenu();