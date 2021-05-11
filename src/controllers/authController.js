const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken"); //el token se crea cada vez que se registra o inicia sesion
const config = require("../config");
const verifyToken = require("./verifyToken");
const User = require("../models/User");

//*****EN POSTMAN: en "headers" pasar en key: Content-Type, y en value pasar:application/json, y en el tab "body" pasar los parametros que requiere la ruta(username,email,password)***/
//registrarse//////////////////////////////////////
//////////////////////////////////////////////////
//Cuando el usuario se registra el servidor devuelve un token, el cual permite que usuario pueda pedirle datos
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;
  const user = new User({
    username: username, //como tienen el mismo nombre se puede dejar solo "username"
    email: email,
    password: password,
  });
  //cifrando la contrasena
  user.password = await user.encryptPassword(user.password); //se usa await porq es un metodo asincrono y el metodo sPe usa desde la instancia user
  //guardando al usuario
  await user.save();
  //creando el token
  const token = jwt.sign({ id: user._id }, config.secret, {
    //sign permite registrar o crear un token
    expiresIn: 60 * 60 * 60, //se debe pasar el tiempo en segundos
  });
  res.json({ auth: true, token });
});
///inicio///////////////////////////////////////////
///////////////////////////////////////////////////
//ruta que devuleve cierta informacion SOLO cuando el usuario tenga autorizacion(cuando tenga un token)
//1ro se verifica si el usuario tiene un token, que se verifica en la cabecera del req(req.header)
// en el header pasar==>  Content-Type: application/json //// x-access-token: tokenque se genero
router.get("/me", verifyToken, async (req, res, next) => {
  const user = await User.findById(req.userId, { password: 0 }); //el id del decoded es el id del usuario
  if (!user) {
    return res.status(404).send("No user found");
  }
  res.json(user);
});
//ingresar/logear/////////////////////////////////////////
///////////////////////////////////////////////////
router.post("/signin", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }); // se usa el email para logear al usuario
  if (!user) {
    return res.status(404).send("Email does not exit");
  }
  const validPassword = await user.validatePassword(password); //retorna true o false
  if (!validPassword) {
    return res.status(401).json({ auth: false, token: null });
  }
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24,
  });
  res.json({ auth: true, token });
});
module.exports = router;
//*****EN POSTMAN: en "headers" pasar en key: Content-Type, y en value pasar:application/json, y en el tab "body" pasar los parametros que requiere la ruta(email,password)***/
