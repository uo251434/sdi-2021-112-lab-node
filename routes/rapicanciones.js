module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}
        let user = req.session.usuario;
        gestorBD.obtenerCanciones(criterio, function (canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                validarOwnerCancion(canciones[0], user, function (error){
                    if(error == null){
                        gestorBD.eliminarCancion(criterio,function(canciones){
                            if ( canciones == null ){
                                res.status(500);
                                res.json({
                                    error : "se ha producido un error"
                                })
                            } else {
                                console.log("cancion eliminada con exito")
                                res.status(200);
                                res.send( JSON.stringify(canciones) );
                            }
                        });
                    }else{
                        res.status(500);
                        console.log(error)
                        res.json({
                            error : error
                        })
                    }
                })
            }
        })

    });


    app.post("/api/cancion", function(req, res) {
        let cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
            autor : req.session.usuario
        }

        validarDatosCancion(cancion, function(error){
            if(error != null && error.length > 0){
                res.status(500);
                console.log("error")
                res.json({
                    errores : error
                })
                console.log("error")
            }
            else{
                gestorBD.insertarCancion(cancion, function(id){
                    if (id == null) {
                        console.log(id)
                        error.push("se ha producido un errror al insertar cancion");
                        res.status(500);
                        res.json({
                            errores:error
                        })
                    } else {
                        console.log(id)
                        res.status(201);
                        res.json({
                            mensaje : "canción insertada",
                            _id : id
                        })
                    }

                })

            }
        });

    });


    app.put("/api/cancion/:id", function(req, res) {

        let criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id) };

        let cancion = {}; // Solo los atributos a modificar
        if ( req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if ( req.body.genero != null)
            cancion.genero = req.body.genero;
        if ( req.body.precio != null)
            cancion.precio = req.body.precio;

        validarDatosCancion(cancion, function(error){
            if(error != null || error.length > 0){
                res.status(500);
                res.json({
                    errores : error
                })
            }
            else{
                gestorBD.modificarCancion(criterio, cancion, function(result) {
                    if (result == null) {
                        error.push("se ha producido un error al actualizar")
                        res.status(500);
                        res.json({
                            errores : error
                        })
                    } else {
                        res.status(200);
                        res.json({
                            mensaje : "canción modificada",
                            _id : req.params.id
                        })
                    }
                });

            }
        });

        gestorBD.modificarCancion(criterio, cancion, function(result) {
            if (result == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.json({
                    mensaje : "canción modificada",
                    _id : req.params.id
                })
            }
        });
    });

    app.post("/api/autenticar", function(req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');
        let criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(401);
                res.json({
                    autenticado : false
                })
            } else {
                let token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                req.session.usuario = criterio.email;
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }
        });
    });

    function validarDatosCancion(cancion, functionCallback){
        let errores = [];
        if(cancion.nombre == null || cancion.nombre.length <3){
            errores.push("El nombre ha de ser de al menos 3 letras");
        }
        if( cancion.genero == null ||cancion.genero.length < 3){
            errores.push("El genero debe tener al menos 3 letras");
        }
        if(cancion == null || cancion.precio === "" || cancion.precio <= 0 ){
            errores.push("El precio ha de ser un numero positivo");
        }
        functionCallback(errores);


    }

    function validarOwnerCancion (cancion, user, functionCallback){
        if(cancion.autor != user){
            functionCallback("error: la cancion no es tuya");
        }
        else{
            functionCallback(null);
        }
    }

}
