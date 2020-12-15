const express = require('express');
const Usuario = require('../models/usuario');
const { verificarToken, verificaAdmon_Role } = require('../middlewares/autenticacion')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();


app.get('/usuario', verificarToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    status: false,
                    message: err.message
                })
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                res.json({
                    status: true,
                    usuarios,
                    cuantos: conteo
                })
                console.log('Usuarios: ', usuarios, conteo);
            })

        })
});

app.post('/usuario', [verificarToken, verificaAdmon_Role], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            })
        }

        res.json({
            status: true,
            usuario: usuarioDB
        })
        console.log('Usuario: ', usuarioDB);
    })
});

app.put('/usuario/:id', [verificarToken, verificaAdmon_Role], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            })
        }
        res.json({
            status: true,
            usuario: usuarioDB
        })
        console.log('Usuario: ', usuarioDB);
    })
});

app.delete('/usuario/:id', [verificarToken, verificaAdmon_Role], function(req, res) {
    let id = req.params.id;
    //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                status: false,
                message: err.message
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                status: false,
                message: 'Usuario no encontrado'
            })
        }
        res.json({
            status: true,
            usuario: usuarioBorrado
        })
    })
});

module.exports = app;