const Filter = require('bad-words');

const {io, server} = require('./app');
const {PORT}  = require('./constants');

const welcomeMessage = 'Welcome!';
const newClientJoined = 'Here comes a new challenger!';

io.on('connection', (socket) => {
    console.log('Here comes a new challenger!');
    socket.emit('message', welcomeMessage);
    socket.broadcast.emit('message', newClientJoined);

    socket.on('disconnect', () => {
        io.emit('sendMessage', 'Farewell, hero!');
    });

    socket.on('message', (message, callback) => {
        const filter = new Filter();

        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!');
        }

        socket.broadcast.emit('message', message);
        callback();
    });

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.lat},${coords.long}`);
        return callback();
    })

});

server.listen(PORT, () => {
    console.log(`Port ${PORT}. Here we go again! :)`);
});