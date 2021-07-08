const mysql = require('mysql2');
const express = require('express');
var app = express();
const bodparser = require('body-parser');

app.use(bodparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'bddprueba',
    multipleStatements: true
});

mysqlConnection.connect((err=> {
    if(!err)
    console.log('DB connection succeded.'); 
    else 
    console.log('DB connection failed \n Error: ' + JSON.stringify(err,undefined,2));
}));

app.listen(3000, ()=>console.log('Express server is running at port no: 3000'));

//Get all users
app.get('/Users',(req,res)=>{
    mysqlConnection.query('SELECT * FROM usuario',(err, rows, fields)=> {
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});

//Get a single user 
app.get('/Users/:id',(req,res)=>{
    mysqlConnection.query('SELECT * FROM usuario WHERE id = ?',[req.params.id],(err, rows, fields)=> {
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});

//Post (insert) a user
app.post('/Users/add',(req,res)=> {
    let user = req.body;
    mysqlConnection.query('INSERT INTO usuario (Nombre, Apellido)\
                             VALUES (?,?);',
                             [user.nombre, user.apellido],(err, rows, fields)=> {
        if(!err) {
            res.send(rows);
            console.log('User inserted');
        }        
        else
        console.log(err);
    })
});

//Post (update) a user
app.post('/Users/update',(req,res)=> {
    let user = req.body;    

    mysqlConnection.query('UPDATE usuario \
                           SET \
                            Nombre = ?,\
                            Apellido = ?\
                            WHERE id = ?;',
                            [user.nombre, user.apellido, user.id],(err, rows, fields)=> {
        if(!err) {
            res.send(rows);
            console.log('User updated');
        }        
        else
        console.log(err);
    })
});

//Delete a user 
app.get('/DeleteUser/:id',(req,res)=>{
    mysqlConnection.query('DELETE FROM usuario WHERE id = ?',[req.params.id],(err, rows, fields)=> {
        if(!err)
        res.send('Deleted successfully');
        else
        console.log(err);
    })
});
