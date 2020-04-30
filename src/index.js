const app = require('./app');
const {PORT, PUBLIC_DIR}  = require('./constants');

app.listen(PORT, () => {
    console.log(`Port ${PORT}. Here we go again! :)`);
});