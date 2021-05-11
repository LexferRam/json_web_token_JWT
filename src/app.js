const express = require('express');
const app = express();

app.use(express.json());//para entender archivo json
app.use(express.urlencoded({ extended: false }));//para entender datos de un formulario

app.use(require('./controllers/authController'));

module.exports = app;