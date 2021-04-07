module.exports = function(app, swig, gestorBD) {

    app.post("/comentarios/:cancion_id", function(req, res) {

        if ( req.session.usuario == null){
            res.redirect("/tienda");
            return;
        }

        let comentario = {
            cancion_id : gestorBD.mongo.ObjectID(req.params.cancion_id),
            texto : req.body.comentario,
            autor: req.session.usuario
        }
        console.log(comentario);
        // Conectarse
        gestorBD.insertarComentario(comentario, function(id){
            if (id == null) {
                res.send("Error al insertar comentario");
            } else {
                res.redirect("/cancion/" +req.params.cancion_id);
            }
        });
    });
};