const inquirer= require('inquirer');
const cTable= require('console.table');
const mysql = require('mysql2');

require('dotenv').config();

//Database configuration
const dbConfig = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
}

// Connect to database
const db = mysql.createConnection(dbConfig,
    console.log(` +++ Connected to ${process.env.DB_NAME}`)
).promise(); // <== Enable Promise based syntax
