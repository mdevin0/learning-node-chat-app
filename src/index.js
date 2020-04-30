const {io, server} = require('./app');
const {PORT, PUBLIC_DIR}  = require('./constants');

io.on('connection', () => {
    console.log('Here comes a new challenger!');
});

server.listen(PORT, () => {
    console.log(`Port ${PORT}. Here we go again! :)`);
});