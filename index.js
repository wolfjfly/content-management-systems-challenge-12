const inquirer=require('inquirer')
const mysql= require('mysql2');
const dbConfig= require('./config/config')
require('console.table');

// Connect to database
const db= mysql.createConnection(dbConfig,
    console.log(` +++ Connected to ${process.env.DB_NAME}`))


const addDepartment= async()=>{
    try{
        console.log('Adding to department');
        const departmentData= await inquirer.prompt([
            {
                name: 'department',
                type: 'input',
                message: 'What is the name of the new department?'
            }
        ]);
        db.query(`INSERT INTO department (department_name) VALUES ('${departmentData.department}')`, {
        });
        console.log(`${departmentData.department} added to the department table!`)
        menu();
    }
    catch(err){
        console.log("addDepartment" + err);
    }
};
const addRole= async()=>{
    try{
        console.log('Adding to roles');
        const department=(await db.promise().query('SELECT * FROM department'))[0];
        const departmentChoices=department.map(dep=>{return{name: dep.department_name, id: dep.id}});
        console.log(departmentChoices)
        const roleData=await inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'What is the name of the new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the new role?'
            },
            {
                name: 'department',
                type: 'list',
                message: 'Choose from the list of departments',
                choices: departmentChoices
            }
        ]);
        db.promise().query(`SELECT id FROM department WHERE department.department_name = '${roleData.department}'`)
            .then(depId=>{
                console.log('department:', depId)
                db.promise().query(`INSERT INTO role (title, salary, department_id) VALUES('${roleData.title}', '${roleData.salary}', '${depId[0][0].id}')`)
                    .then(res=>{console.log('result:', res)});
            });
        console.log(`${roleData.title} added to the roles table!`)
        menu();
    }
    catch (err) {
        console.log("add role" + err);
    }
};
const addEmployee=async()=>{
    try{
        console.log('Adding to employees');
        const roles=(await db.promise().query('SELECT * FROM role'))[0];
        const roleChoices=roles.map(roles=>{return({name: role.title, id: role.id})});
        const employeeData=await inquirer.prompt([
            {
                name: 'first',
                type: 'input',
                message: 'What is the first name of the new employee?'
            },
            {
                name: 'last',
                type: 'input',
                message: 'What is the last name of the new employee?'
            },
            {
                name: 'title',
                type: 'list',
                message: 'Choose from list of roles for the employee',
                choices: roleChoices
            }
        ]);
        db.promise().query(`SELECT id FROM role WHERE role.title = '${employeeData.title}'`)
            .then(rolesId=>{
                db.promise().query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ('${employeeData.first}', '${employeeData.last}', '${roleId[0][0].id}') `)
                    .then(res=>{ console.log('result:', res)});
            });
        console.log(`${employeeData.first, employeeData.last, employeeData.title} added to the table!`)
        menu();
    }
    catch(err){
        console.log("add employee" + err);
    }
};
const viewRoles=function(){
    db.query('SELECT * FROM role INNER JOIN department ON role.department_id=department.id', (err, result) => {
        if(err){
            console.log("veiw roles" + err)
        }
        console.log('\n');
        console.table(result);
    })
    menu();
};
const viewDepartments=function(){
    db.query('SELECT * FROM department', (err, result)=>{
        if(err){
            console.log("veiw departments" + err)
        }
        console.log('\n')
        console.table(result);
    })
    menu();
};
const viewEmployees=function(){
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.department_name AS department, CONCAT(manager.first_name,' ' , manager.last_name) AS manager FROM employee employee INNER JOIN roles role ON employee.role_id= role.id INNER JOIN departments department ON role.department_id= department.id LEFT JOIN employee manager ON employee.manager_id = manager.id ORDER BY employee.last_name`,
                (err, result)=>{
        if(err){
            console.log("veiw employees" +err)
        }
        console.log('\n')
        console.table(result);
    })
    menu();
};
const updateEmployeeRole=async()=>{
    try{
        console.log('Update an employee');
        const employees= (await db.promise().query('SELECT * FROM employee'));
        const roleUpdate= (await db.promise().query('SELECT * FROM role'));
        const employeeChoices= employees.map(employees=>{return{first_name: employee.first_name, last_name: employee.last_name}});
        const roleChoices= roleUpdate.map(roleUpdate=>{return{names: roleUpdate.title, id: roleUpdate.id}});
        const roleData= await inquirer.prompt[(
            {
                name: 'employee',
                type: 'list',
                message: 'Choose the Employee you would like to update',
                choices: employeeChoices
            },
            {
                name: 'role',
                type: 'list',
                message: 'Choose the role you would like to update',
                choices: roleChoices
            },
            {
                name: 'update',
                type: 'input',
                message: 'Choose a new role for the employee',
                choices: roleChoices
            }
        )];
    }
    catch(err){
        console.log("update employee role" + err);
    }
};
const menu= async()=>{
    try{
        const choice= await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['Add a department', 'Add a role', 'Add an employee', 'View all roles', 'View all departments', 'View all employees', 'Update an employee role', 'Exit Application'],
        });
        switch(choice){
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all departments':
                viewDepartments();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default: process.exit();
        }
    }
    catch(err){console.log("menu" + err)};
};

menu();