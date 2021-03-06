const express= require('express')
const app = express()
const path = require("path")
const bodyParser = require("body-parser")
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger_output.json')
var sqlite3 = require('sqlite3').verbose()
const {Pool} = require("pg");
const { Console } = require('console')
const pool = new Pool({
    connectionString: '',
    ssl: {
    rejectUnauthorized: false
    }
   });
   
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
    var arr=[]
    let user= {
        FirstName: "Jaime",
        LastName: "Salazar",
    }
    const result = await client.query({
        rowMode: 'array',
        text: 'SELECT * FROM Users;',
      })

     const length= result.rows.length

     for (let i = 0; i < length; i++) {
        console.log(result.rows[i]['FirstName'])
        console.log(result.rows[i]['LastName'])
        arr.push({FirstName: result.rows[i]['FirstName'],
        LastName: result.rows[i]['LastName']})
      }
      
      res.json(arr)

})

app.listen(PORT,()=>{
    console.log('Ejemplo de aplicaci??n escuchando en http://localhost:3000')
})
