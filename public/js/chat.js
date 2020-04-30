const socket = io();

socket.on('countUpdated', (count) => {
    console.log(`The count has been updated! ${count} challengers connected`);
});

document.querySelector('#inc').addEventListener('click', () => {
    console.log('Clicked!');
    socket.emit('increment');
});