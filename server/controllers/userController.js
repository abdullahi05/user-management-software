// connect to my database
const mysql = require('mysql2');

//connection pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
})



// View users
exports.view = (req, res) => {

    //connect to db
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('DB connected ' + connection.threadId);

        // use the connection
        connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => { // we can get an err or data as rows
            // when done with the connection, release it
            connection.release();
            // if there is no error render the home page in views folder
            if (!err) {
                let removedUser = req.query.removed
                res.render('home', { rows, removedUser })
            } else {
                console.log(err)
            }

            console.log('the data from user table: \n', rows)

        })
    });
}

// search section => find user by search
exports.find = (req, res) => {
    //connect to db
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('DB connected ' + connection.threadId);

        let searchItem = req.body.search;

        // use the connection
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ?', ['%' + searchItem + '%', '%' + searchItem + '%', '%' + searchItem + '%'], (err, rows) => { // we can get an err or data as rows
            // when done with the connection, release it
            connection.release();
            // if there is no error render the home page in views folder
            if (!err) {
                res.render('home', { rows })
            } else {
                console.log(err)
            }

            console.log('the data from user table: \n', rows)

        })
    });
};

exports.form = (req, res) => {
    res.render('add-user')
}

// add new user section
exports.create = (req, res) => {

    // first will have to destructure the data
    const { first_name, last_name, email, phone, comments } = req.body;

    //connect to db
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('DB connected ' + connection.threadId);

        let searchItem = req.body.search;

        // use the connection
        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, rows) => { // we can get an err or data as rows
            // when done with the connection, release it
            connection.release();
            // if there is no error render the home page in views folder
            if (!err) {
                res.render('add-user', { alert: 'Holy Guacamole, User added successfully' })
            } else {
                console.log(err)
            }

            console.log('the data from user table: \n', rows)

        })
    });
}

// edit user data
exports.edit = (req, res) => {
    //connect to db
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('DB connected ' + connection.threadId);

        let searchItem = req.body.search;

        // use the connection
        connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => { // we can get an err or data as rows
            // when done with the connection, release it
            connection.release();
            // if there is no error render the home page in views folder
            if (!err) {
                res.render('edit-user', { rows })
            } else {
                console.log(err)
            }

            console.log('the data from user table: \n', rows)

        })
    });
}


// update user data
exports.update = (req, res) => {
    // grab the data
    const { first_name, last_name, email, phone, comments } = req.body
    //connect to db
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('DB connected ' + connection.threadId);

        let searchItem = req.body.search;

        // use the connection
        connection.query('UPDATE user SET first_name = ? , last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, req.params.id], (err, rows) => { // we can get an err or data as rows
            // when done with the connection, release it
            connection.release();

            // if there is no error render the home page in views folder
            if (!err) {
                //connect to db
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('DB connected ' + connection.threadId);

                    let searchItem = req.body.search;

                    // use the connection
                    connection.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, rows) => { // we can get an err or data as rows
                        // when done with the connection, release it
                        connection.release();
                        // if there is no error render the home page in views folder
                        if (!err) {
                            res.render('edit-user', { rows, alert: `${first_name} has been updates successfully` })
                        } else {
                            console.log(err)
                        }

                        console.log('the data from user table: \n', rows)

                    })
                });
            } else {
                console.log(err)
            }

            console.log('the data from user table: \n', rows)

        })
    });
}

// delete user data
exports.delete = (req, res) => {
    // //connect to db
    // pool.getConnection((err, connection) => {
    //     if (err) throw err;
    //     console.log('DB connected ' + connection.threadId);

    //     let searchItem = req.body.search;

    //     // use the connection
    //     connection.query(' DELETE FROM user WHERE id = ?', [req.params.id], (err, rows) => { // we can get an err or data as rows
    //         // when done with the connection, release it
    //         connection.release();
    //         // if there is no error render the home page in views folder
    //         if (!err) {
    //             res.redirect('/');
    //         } else {
    //             console.log(err)
    //         }

    //         console.log('the data from user table: \n', rows)

    //     })
    // });

    // SET THE STATUS of the deleted user from active to removed
    pool.getConnection((err, connection) => {
        if (err) throw err;
        connection.query('UPDATE user SET status = ? WHERE id= ?', ['removed', req.params.id], (err, rows) => {
            connection.release(); // return the connection to pool
            if (!err) {
                // return message after deleting the user
                let removedUser = encodeURIComponent('User deleted successfully')
                res.redirect('/?removed=' + removedUser)
            } else {
                console.log(err)
            }
            console.log('data from user table are: \n', rows)
        })
    })
}


// View users
exports.viewall = (req, res) => {

    //connect to db
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('DB connected ' + connection.threadId);

        // use the connection
        connection.query('SELECT * FROM user WHERE id = ? ', [req.params.id], (err, rows) => { // we can get an err or data as rows
            // when done with the connection, release it
            connection.release();
            // if there is no error render the home page in views folder
            if (!err) {
                res.render('view-user', { rows })
            } else {
                console.log(err)
            }

            console.log('the data from user table: \n', rows)

        })
    });
}
