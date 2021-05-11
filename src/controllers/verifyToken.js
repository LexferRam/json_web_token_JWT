const jwt = require("jsonwebtoken");
const config = require("../config");

//se crea un middleware para reusar esta funcion en cualquier ruta
function verifyToken(req, res, next) {
  //si existe la cabecera 'x-access-token' quiere decir que el usuario tiene un token y tiene autorizacion
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "No token provided",
    });
  }
  //si existe un token se ejecuta lo siguiente
  const decoded = jwt.verify(token, config.secret);
  // el metodo 'verify' verifica el token y lo decodifica usando el 'secret'
  //cuando decodifica separa en header, payload y verify signature
  req.userId = decoded.id;
  //desde cualquier ruta se puede acceder a esta propiedad userId desde el req el cual contiene el id
  next();
}

module.exports = verifyToken;
