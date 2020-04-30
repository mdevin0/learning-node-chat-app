const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const {PUBLIC_DIR}  = require('./constants');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(PUBLIC_DIR));


module.exports = {
    io,
    server
};