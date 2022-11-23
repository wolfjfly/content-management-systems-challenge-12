require('dotenv').config();

//Database configuration
const dbConfig = {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
}

module.exports = dbConfig;






