require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// parser application/json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Configuración Global de Routes
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err, res) => {
    if (err) throw err;
    console.log('BASE DE DATOS MONGO ONLINE');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
});