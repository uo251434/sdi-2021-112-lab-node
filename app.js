//Modulos
let express = require('express');
let app = express();

let expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

let crypto = require('crypto');

let fileUpload = require('express-fileupload');
app.use(fileUpload());


//mongodb://admin:sdi@tiendamusica-shard-00-00.7ya3n.mongodb.net:27017,tiendamusica-shard-00-01.7ya3n.mongodb.net:27017,tiendamusica-shard-00-02.7ya3n.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-e7np4x-shard-0&authSource=admin&retryWrites=true&w=majority

let swig = require('swig');
let bodyParser = require('body-parser');

let mongo = require('mongodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);


app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db', 'mongodb://admin:sdi@tiendamusica-shard-00-00.7ya3n.mongodb.net:27017,' +
    'tiendamusica-shard-00-01.7ya3n.mongodb.net:27017,' +
    'tiendamusica-shard-00-02.7ya3n.mongodb.net:27017/' +
    'myFirstDatabase?ssl=true&replicaSet=atlas-e7np4x-shard-0&authSource=admin&retryWrites=true&w=majority')

app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rusuarios.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rcanciones.js")(app, swig, gestorBD); // (app, param1, param2, etc.)
require("./routes/rautores.js")(app, swig); // (app, param1, param2, etc.)


//lanzar el serviddor
app.listen(app.get('port'), function() {
    console.log('Servidor activo');
})