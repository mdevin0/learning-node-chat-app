const socket = io();

const chatArea = document.querySelector('#chatArea');
const chatForm = document.querySelector('#chatForm');

socket.on('message', (message) => {
    console.log(message);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    socket.emit('sendMessage', e.target.elements.messageToSend.value);

});

socket.on('receiveMessage', (message) => {
    chatArea.innerHTML = message;
});