const mysql = require('mysql2');
const express = require('express');
var app = express();
const bodparser = require('body-parser');

app.use(bodparser.json());

var mysqlConnection = mysql.createConnection({
    host: '34.138.80.34',
    user: 'alexanderRodSua',
    password: 'default12345',
    database: 'bddProofOfConcept',
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
app.get('/Facturas',(req,res)=>{
    mysqlConnection.query('CALL GetAll();',(err, rows, fields)=> {
        if(!err)
        res.send(rows);
        else
        console.log(err);
    })
});

//Get a single user 
app.get('/Facturas/:id',(req,res)=>{
    mysqlConnection.query('CALL GetSingle(?);',[req.params.id],(err, rows, fields)=> {
        if(!err)
        res.send(rows);        
        else
        console.log(err);
    })
});

//Post (insert) a user
app.post('/Facturas/add',(req,res)=> {
    let factura = req.body;
    mysqlConnection.query('CALL AddSingle(?,?,?,?,?);',    
                             [factura.Cliente, factura.Peso, factura.Precio, factura.Subtotal,factura.Total],(err, rows, fields)=> {
        if(!err) {
            res.send(rows);
            console.log('Factura agregada');
        }        
        else
        console.log(err);
    })
});

//Post (update) a user
app.post('/Facturas/update',(req,res)=> {
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
app.get('/Facturas/Delete/:id',(req,res)=>{
    mysqlConnection.query('CALL DeleteSingle(?);',[req.params.id],(err, rows, fields)=> {
        if(!err)
        res.send('Deleted successfully');
        else
        console.log(err);
    })
});
