var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
});

con.connect( err => {
    if (err) { 
        throw err;
    }
    console.log("connected")
})