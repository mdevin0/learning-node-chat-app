const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {PUBLIC_DIR}  = require('./constants');
const {generateMessage} = require('./utils/message');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const welcomeMessage = 'Welcome!';
const newClientJoined = 'Here comes a new challenger!';

app.use(express.static(PUBLIC_DIR));

io.on('connection', (socket) => {
    console.log('Here comes a new challenger!');
    socket.emit('message', generateMessage(welcomeMessage));
    socket.broadcast.emit('message', generateMessage(newClientJoined));

    socket.on('disconnect', () => {
        io.emit('sendMessage', 'Farewell, hero!');
    });

    socket.on('message', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!');
        }

        io.emit('message', generateMessage(message));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', 
                generateMessage(`https://google.com/maps?q=${coords.lat},${coords.long}`));
        return callback();
    })

});

module.exports = {
    io,
    server
};