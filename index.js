const inquirer = require('inquirer');
require('console.table');
const mysql = require('mysql2');
const dbConfig= require('./config/config')

// Connect to database
const db = mysql.createConnection(dbConfig,
    console.log(` +++ Connected to ${process.env.DB_NAME}`))


const getAllEmployee=()=>{
    return db.promise().query(`SELECT employee.id AS "employee id", employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id;`
    );
}

const addEmployee=()=>{}

const updateEmployeeRole=()=>{}

const getAllDepartments=()=>{
    return db.promise().query('SELECT department.name, department.id FROM employee_db.department');
}

const addDepartment=()=>{}

const getAllRoles=()=>{
    return db.promise().query('SELECT role.title, role.id, department.name, role.salary FROM employee_db.department, employee_db.employee, employee_db.role');
}

const addRole=()=>{}





const menu=()=>{
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do"',
                name: 'main',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Veiw All Roles','Add Role', 'Veiw All Departments','Add Department','Quit'],
            },
        ])
        .then((data) => {
            if(data.main==='View All Employees'){
                getAllEmployee().then((employee)=>{
                    console.table(employee[0])
                return menu();
                })
            
            }else if (data.main==='Add Employee'){

            }else if (data.main==='Update Employee Role'){

            }else if (data.main==='Veiw All Roles'){
                getAllRoles().then((roles)=>{
                    console.table(roles[0])
                return menu();
                })

            }else if (data.main==='Add Role'){

            }else if (data.main==='Veiw All Departments'){
                getAllDepartments().then((department)=>{
                    console.table(department[0])
                return menu();
                })

            }else if (data.main==='Add Department'){
            
            }
    });
}
menu()