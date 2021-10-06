const express= require('express')
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger_output.json')
var sqlite3 = require('sqlite3').verbose()
var pgp = require("pg-promise")({});
var db = pgp("postgres://nmjfcyduzmwzke:587c1691cd45e5abd32c3719680280454ddaf450f97acbc8d5132b5719a1c555@ec2-52-204-213-254.compute-1.amazonaws.com:5432/d3kv627bou2k9c?ssl=true");

const PORT = process.env.PORT || 5000


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/',(req,res) => {

    res.send('Hello world!!!')

})
var coco=[]

app.get('/database',(req,res) => {
    var db = new sqlite3.Database(':memory:');

    db.serialize(function() {

        db.run('CREATE TABLE lorem (info TEXT)');
        var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
      
        for (var i = 0; i < 10; i++) {
          stmt.run('Ipsum ' + i);
        }
      
        stmt.finalize();
      
        db.each('SELECT rowid AS id, info FROM lorem', function(err, row) {
            coco.push(row.id + ': ' + row.info);
        }
        );

      });
      
      db.close();      

})

app.get('/agente',(peticion,respuesta) => {

    let agenteUsuario=peticion.header('user-agent')
    respuesta.send('La ruta solicitada es /agente con:'+ agenteUsuario)
})

app.get('/persona',(req,res) => {

    
    let persona= {
        nombre: "Jaime",
        edad: 34,
    }
    res.json(persona)

})

///Users/newuser/IdeaProjects/HolaMundoExpress
app.get('/pagina',(req,res) => {

    let ruta=path.join(__dirname,"index.html")
    res.sendFile(ruta)

})



app.get('/postgres',(req,res) => {
    db.connect()
db.one("SELECT $1 AS value", 123)
    .then(function (data) {
        console.log("DATA:", data.value);
    })
    .catch(function (error) {
        console.log("ERROR:", error);
    });

})

app.listen(PORT,()=>{
    console.log('Ejemplo de aplicación escuchando en http://localhost:3000')
})