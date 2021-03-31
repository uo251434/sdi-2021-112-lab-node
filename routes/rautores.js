module.exports = function(app, swig) {


    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/bagregar-autor.html', {

        });
        res.send(respuesta);
    })


    app.get("/autores/", function(req, res) {


        let autores = [ {
            "nombre" : "Slash",
            "grupo" : "guns 'n roses",
            "rol" : "guitarrista"
        },{
            "nombre" : "el fari",
            "grupo" : "solitario",
            "rol" : "cantante"
        },{
            "nombre" : "knekro",
            "grupo" : "g3",
            "rol"   : "bajista"
        }];

        let respuesta =  swig.renderFile('views/bautores.html', {
            vendedor : 'Tienda de canciones',
            autores : autores
        });


        res.send(respuesta);
    });



    app.post("/autor", function(req, res) {
        var result = "";
        if(req.body.nombre === null || req.body.nombre === "" || typeof(req.body.nombre) === undefined){
            result += "Nombre no enviado en la petición";
        }
        else{
            result += "Nombre: " + req.body.nombre;
        }
        result += "<br>";
        if (req.body.grupo === null || req.body.grupo === "" || typeof(req.body.grupo) === undefined){

            result += "Grupo no enviado en la petición";
        } else {
            result += "Grupo: " + req.body.grupo;
        }
        result += "<br>";
        if(req.body.rol === null || req.body.rol === ""  || typeof(req.body.rol) === undefined){
            result += "Rol no enviado en la petición";
        }
        else{
            result += "Rol: " + req.body.rol;
        }
        result += "<br>";
        res.send(result);
    })

    app.get("/autores*", function(req, res) {

        res.redirect("/autores/");
    });

};