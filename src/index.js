const {io, server} = require('./app');
const {PORT, PUBLIC_DIR}  = require('./constants');

let count = 0;
io.on('connection', (socket) => {
    console.log('Here comes a new challenger!');
    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        count++;
        io.emit('countUpdated', count)
    });
});

server.listen(PORT, () => {
    console.log(`Port ${PORT}. Here we go again! :)`);
});