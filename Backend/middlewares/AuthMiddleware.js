const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authMiddleware = (req, res, next) => {
    try {
        let token = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token válido.' });
        }
        const decoded = jwt.verify(token, config.jwtSecret);
        
        // Adjuntar los datos decodificados del usuario a la petición
        req.usuario = decoded;
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
};

const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !req.usuario.rolNombre) {
            return res.status(403).json({ error: 'No se encontró el rol del usuario.' });
        }
        
        if (!rolesPermitidos.includes(req.usuario.rolNombre)) {
            return res.status(403).json({ error: 'Acceso denegado. No tienes permisos para realizar esta acción.' });
        }
        
        next();
    };
};

authMiddleware.verifyToken = authMiddleware;
module.exports = { authMiddleware, verifyRole };
