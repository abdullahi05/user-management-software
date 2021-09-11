// setting up an express server
const express = require('express');
const app = express();
// specify a port number for express to listen to
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

// setting up dependencies
const exphbs = require('express-handlebars'); // express handle-bars
const bodyParser = require('body-parser'); // body parsers
const mysql = require('mysql2') // mysql
require('dotenv').config(); // dotenv

// body parser is a parsing middle ware hepls us pass json data through our forms
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// setting my static files: my css, html files, js files images etc
app.use(express.static('public')) // create folder 'public'

//templating engine enables to use static files in our app
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs')


// database connection pool connect my database to my app
const pool = mysql.createPool({
    // create .env file to add all mysql credentials like username and password
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME
})

// connect to your db
pool.getConnection((err, connection) => {
    if (err) throw err; // not connected throw error
    console.log('connected to DB as' + connection.threadId) // else connection successfull
})


//router and routes created in server folder
const routes = require('./server/routes/user');
app.use('/', routes); // let express use this links to routes folder




