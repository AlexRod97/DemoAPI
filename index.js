const mysql = require('mysql2');
const express = require('express');
var app = express();
const http = require('http');
var bodyParser = require('body-parser')
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

var mysqlConnection = mysql.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    socketPath: `/cloudsql/${process.env.CLOUD_SQL_CONNECTION_NAME}`
});


app.get('/', (req, res, next) => {
    res.status(200).send("hello from app engine");
});

//Get all users
app.get('/facturas',(req,res)=>{
    mysqlConnection.query('CALL GetAll();',(err, rows, fields)=> {
        if(!err)
        res.status(201).json(rows);
        
        else
        res.status(401).json(err);
    })
});

//Get a single user 
app.get('/facturas/:id',(req,res)=>{
    mysqlConnection.query('CALL GetSingle(?);',[req.params.id],(err, rows, fields)=> {
        if(!err)
        res.send(rows);        
        else
        console.log(err);
    })
});

//Post (insert) a user
app.post('/facturas/add', (req,res) => {
    let factura = {
        "Cliente": req.body.Cliente,
        "Peso": req.body.Peso,
        "Precio": req.body.Precio,
        "Subtotal": req.body.Subtotal,
        "Total": req.body.Total,
    };

    mysqlConnection.query('INSERT INTO `Factura` (`Cliente`, `Peso`, `Precio`, `Subtotal`, `Total`) VALUES (?, ?, ?, ?, ?)',    
                             [factura.Cliente, factura.Peso, factura.Precio, factura.Subtotal, factura.Total], (err, rows, fields) => {
        if(!err) {
            res.status(201).json(rows);
            console.log('Factura agregada');
        }        
        else
        res.status(401).json(err);
    })
});

//Post (update) a user
app.post('/facturas/update',(req,res)=> {
    let factura = req.body;    

    mysqlConnection.query('CALL EditSingle(?,?,?,?,?,?);',
                            [factura.NumFactura, factura.Cliente, factura.Peso, factura.Precio, factura.Subtotal,factura.Total],(err, rows, fields)=> {
        if(!err) {
            res.send(rows);
            console.log('Factura actualizada');
        }        
        else
        console.log(err);
    })
});

//Delete a user 
app.post('/facturas/Delete/:id',(req,res)=>{
    mysqlConnection.query('CALL DeleteSingle(?);',[req.params.id],(err, rows, fields)=> {
        if(!err)
        res.send('Deleted successfully');
        else
        console.log(err);
    })
});

app.listen(process.env.PORT || 8080, ()=>{});
module.exports = app;