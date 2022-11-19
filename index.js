const inquirer = require('inquirer');
require('console.table');
const mysql = require('mysql2');
const dbConfig= require('./config/config')

// Connect to database
const db = mysql.createConnection(dbConfig,
    console.log(` +++ Connected to ${process.env.DB_NAME}`))

const getAllEmployee=()=>{
    return db.promise().query('SELECT * FROM employee')
}




const menu=()=>{
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do"',
                name: 'main',
                choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'Veiw All Roles','Add Role', 'Veiw All Departments','Add Department'],
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

            }else if (data.main==='Add Role'){

            }else if (data.main==='Veiw All Departments'){

            }else if (data.main==='Add Department'){

            }
    });
}
menu()