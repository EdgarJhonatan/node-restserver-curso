const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: err.message
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                status: false,
                message: 'Password o Usuario inconrrecto'
            })
        }


        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                status: false,
                message: 'Password o Usuario inconrrecto'
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            status: true,
            message: usuarioDB,
            token: token
        })
    })
})




















module.exports = app;