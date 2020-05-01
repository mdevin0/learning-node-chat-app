const Filter = require('bad-words');

const {server} = require('./app');
const {PORT}  = require('./constants');

server.listen(PORT, () => {
    console.log(`Port ${PORT}. Here we go again! :)`);
});