const inquirer=require('inquirer')
const mysql = require('mysql2');
const dbConfig= require('./config/config')
require('console.table');

// Connect to database
const db = mysql.createConnection(dbConfig,
    console.log(` +++ Connected to ${process.env.DB_NAME}`))

// questions
const firstQuestion=[
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Veiw All Roles', 'Add Role', 'Veiw All Departments', 'Add Department'],
        name: 'menu',
    },
];
const addRoleQuestion=[
    {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'title',
        validate: (value)=>{
            if (value) {
                return true;
            } else {
                return 'I demand you answer the question';
            }
        },
    },
    {
        type: 'number',
        message: 'What is the salary of the role?',
        name: 'salary',
        validate: (value)=>{
            if (value) {
                return true;
            } else {
                return 'I demand you answer the question';
            }
        },
    },
    {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: async () => {
            const [results] = await db.promise().query('SELECT id, name FROM department')
            return results
        }
    },
];
const updateEmpRoQuestion=[];

const addEmpQuestion=[];

const addDepartQuestion=[];

// function addRole(){
//     inquirer.prompt(addRoleQuestion).then(function (answers){
//         const title= answers.title;
//         const salary= answers.salary;
//         const department= answers.department;
//         const [results] = db.promise().query('SELECT id FROM department')
//         let departmentIds = results.map(id => id.id)
//         db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, departmentIds])
//         })
// }
// const addEmployee = async () => {
//     db.query(`SELECT role.title, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON role.id = employee.role_id`, async (err, res) => {
//         const answer = await inquirer.prompt([
//             {
//                 type: 'input',
//                 name: 'first_name',
//                 message: "What is the employee's first name?"
//             },
//             {
//                 type: 'input',
//                 name: 'last_name',
//                 message: "What is the employee's last name?"
//             },
//             {
//                 type: 'list',
//                 name: 'role',
//                 message: "What is the employee's role?",
//                 choices: res.map(role => role.title)
//             },
//             {
//                 type: 'list',
//                 name: 'manager',
//                 message: "What is the employee's manager?",
//                 choices: () => {
//                     let managerList = ['None']
//                     for (let i = 0; i < res.length; i++) {
//                         if (res[i].first_name != null || res[i].last_name != null) {
//                             let managerName = `${res[i].first_name} ${res[i].last_name}`
//                             managerList.push(managerName)
//                         }
//                     }
//                     return managerList
//                 }
//             },
//         ])
//         try {
//             const [results] = await bd.promise().query('SELECT id FROM employee')
//             let employeeIds = results.map(id => id.id)
//             const [employeeCount] = await bd.promise().query('SELECT COUNT(id) AS count FROM employee')
//             let employeeID = employeeCount[0].count + 1
//             while (employeeIds.includes(employeeID)) {
//                 employeeID++
//             }
//             const [roleResult] = await db.promise().query('SELECT id FROM role WHERE title = ?', [answer.role])
//             const managerArray = answer.manager.split(' ')
//             if (managerArray[0] != 'None') {
//                 const [managerResult] = await bd.promise().query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [managerArray[0], managerArray[1]])
//                 await db.promise().query(`
//             INSERT INTO employee (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)`, [employeeID, answer.first_name, answer.last_name, roleResult[0].id, managerResult[0].id])
//             } else {
//                 await db.promise().query(`
//             INSERT INTO employee (id, first_name, last_name, role_id) VALUES (?, ?, ?, ?)`, [employeeID, answer.first_name, answer.last_name, roleResult[0].id])
//             }
//         } catch (err) {
//             throw new Error(err)
//         }
//     })
// }
// const updateEmployeeRole = async () => {
//     db.query(`SELECT role.title, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON role.id = employee.role_id`, async (err, res) => {
//         const answer = await inquirer.prompt([
//             {
//                 type: 'list',
//                 name: 'employee',
//                 message: "Which employee's role do you want to update?",
//                 choices: () => {
//                     let employeeList = []
//                     for (let i = 0; i < res.length; i++) {
//                         if (res[i].first_name != null || res[i].last_name != null) {
//                             let employeeName = `${res[i].first_name} ${res[i].last_name}`

//                             employeeList.push(employeeName)
//                         }
//                     }
//                     return employeeList
//                 }
//             },
//             {
//                 type: 'list',
//                 name: 'role',
//                 message: "Which role do you want to assign the selected employee?",
//                 choices: () => {
//                     let roles = res.map(role => role.title)
//                     let rolesList = [...new Set(roles)]
//                     return rolesList
//                 }
//             },
//         ])
//         try {
//             const employeeArray = answer.employee.split(' ')
//             const [employeeResult] = await db.promise().query(`SELECT id FROM employee WHERE first_name = ? AND last_name = ?`, [employeeArray[0], employeeArray[1]])
//             const [roleResult] = await db.promise().query(`SELECT id FROM role WHERE title = ?`, [answer.role])

//             await connection.promise().query(`
//             UPDATE employee SET role_id = ? WHERE id = ?`, [roleResult[0].id, employeeResult[0].id])
//             console.log(`${answer.employee}'s role was updated!`)
//         } catch (err) {
//             throw new Error(err)
//         }
//     })
// }
// async function viewAllEmployee(){
//     const viewAllEmployeeQuery=`SELECT employee.id AS "employee id", employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`
//     try {
//         const results= await db.query(viewAllEmployeeQuery)
//         console.table(results[0])
//     } catch (error) {
//         console.error ("xxx\n Database returned an error: \n", error)
//     }

// }
// const viewAllDepartments = async () => {
//     try {
//         const allDepartments = await db.promise().query(`SELECT department.name, department.id FROM employee_db.department`)
//     } catch (err) {
//         throw new Error(err)
//     }

// }
// const addDepartment = async () => {
//     const answer = await inquirer.prompt([
//         {
//             type: 'input',
//             name: 'name',
//             message: 'What is the name of the department?'
//         }
//     ])
//     try {
//         const [results] = await db.promise().query('SELECT id FROM department')
//         let departmentIds = results.map(id => id.id)
//         const [departmentCount] = await db.promise().query('SELECT COUNT(id) AS count FROM department')

//         let departmentID = departmentCount[0].count + 1

//         while (departmentIds.includes(departmentID)) {
//             departmentID++
//         }
//         await db.promise().query(`INSERT INTO department (id, name) VALUES (?, ?)`, [departmentID, answer.name])
//         console.log("Department was added!")
//         menu()
//     } catch (err) {
//         throw new Error(err)
//     }
// }
const viewAllRoles = async () => {
    try {
        return db.promise().query(`SELECT role.id, role.title, department.name AS department, role.salary FROM employee_db.department, employee_db.employee, employee_db.role`);
    } catch (err) {
        throw new Error(err)
    }
}




function menu() {
    inquirer.prompt(firstQuestion).then(function (userChoice) {
        switch (userChoice.menu) {
            case 'View All Employees':
                console.log(userChoice.menu)
                viewAllEmployee();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
            case 'Veiw All Roles':
                viewAllRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Veiw All Departments':
                viewAllDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            
        }
    });
}
menu()