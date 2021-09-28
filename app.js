const express=require('express')
const app=express()
const path = require("path")
const port=3000
var sqlite3 = require('sqlite3').verbose();

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

app.listen(port,()=>{
    console.log('Ejemplo de aplicación escuchando en http://localhost:3000')
})