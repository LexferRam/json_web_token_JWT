const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
});

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); //genSalt es el nombre del algoritmo que encripta y el parametro son las veces que va aplicarlo
  return bcrypt.hash(password, salt); //es el metodo que convierte un string a caracteres indecifrables
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password); //compara la contrasena pasada con la de la BDs
  //this hace ref al password del userSchema, this no  funciona en funcion arrow
};

module.exports = model("User", userSchema);
