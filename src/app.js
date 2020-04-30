const express = require('express');
const {PUBLIC_DIR}  = require('./constants');

const app = express();

app.use(express.static(PUBLIC_DIR));


module.exports = app;