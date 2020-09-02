var mssql = require('mssql');
var app = require('./app.js')
// app.set('view engine','ejs');

var port = process.env.PORT || 5000;

var config = {
    user: 'war',
    password: '123d1ns@***',
    server: 'diinsa.ddns.net',
    database: 'comercial',
    //port: 1434,
    requestTimeout:120000,
    connectionTimeout: 120000
};

var connection = mssql.connect(config, function (err, res) {
    if (err) {
        throw err;
    }
    else {
        console.log("CONEXION CORRECTA ");
        var server = app.listen(port, () => {
            console.log("Api Rest Running http://localhost:" + port)
        });
        server.timeout = 120000;
    }
});
module.exports = app