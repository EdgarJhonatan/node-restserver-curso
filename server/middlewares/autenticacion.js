const jwt = require('jsonwebtoken')
    //===========
    //Verificar Token
    //===========
let verificarToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: false,
                message: 'token no válido'
            });
        }

        req.usuario = decoded.usuario;
        next();
    })
}

//===========
//Verificar Token Admin
//===========

let verificaAdmon_Role = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            status: false,
            message: 'El usuario no es administrador'
        })
    }
}

module.exports = {
    verificarToken,
    verificaAdmon_Role
}