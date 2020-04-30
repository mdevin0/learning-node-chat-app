const {io, server} = require('./app');
const {PORT}  = require('./constants');

const welcomeMessage = 'Welcome!';
const newClientJoined = 'Here comes a new challenger!';

io.on('connection', (socket) => {
    console.log('Here comes a new challenger!');
    socket.emit('message', welcomeMessage);
    io.emit('message', newClientJoined);

    socket.on('sendMessage', (message) => {
        io.emit('receiveMessage', message);
    });
});

server.listen(PORT, () => {
    console.log(`Port ${PORT}. Here we go again! :)`);
});