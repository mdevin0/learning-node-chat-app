const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const {PUBLIC_DIR}  = require('./constants');
const {generateMessage} = require('./utils/message');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

const welcomeMessage = 'Here comes a new challenger!';

app.use(express.static(PUBLIC_DIR));

io.on('connection', (socket) => {
    console.log(`Socket id '${socket.id}' just connected.`);

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message', generateMessage('Server', `Farewell, ${user.name}!`));
            io.to(user.room).emit('roomChanged', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
        console.log(`Socket id '${socket.id}' disconnected.`);
    });

    socket.on('join', (options, callback) => {
        const {error, user} = addUser({id: socket.id, user: options.user, room: options.room});

        if(error){
            return callback(error);
        }

        socket.join(user.room);
        console.log(`Socket id '${socket.id}' joined room '${user.room}' as '${user.name}'.`);

        socket.emit('message', generateMessage(user.name, welcomeMessage));
        socket.broadcast.to(user.room).emit('message', generateMessage('Server', `${user.name} has joined.`));
        io.to(user.room).emit('roomChanged', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on('message', (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!');
        }

        io.to(user.room).emit('message', generateMessage(user.name, message));
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', 
                generateMessage(user.name, `https://google.com/maps?q=${coords.lat},${coords.long}`));
        return callback();
    })

});

module.exports = {
    io,
    server
};