const socket = io();

const chatArea = document.querySelector('#chatArea');
const chatForm = document.querySelector('#chatForm');
const locationButton = document.querySelector('#sendLocation');

const createMessage = (message, received) => {
    const newMessage = document.createElement("p");
    newMessage.innerText = (received ? 'received: ' : 'sent: ') + message;
    newMessage.className = ('class', received ? 'received' : 'sent');
    chatArea.appendChild(newMessage);
}

socket.on('message', (message) => {
    createMessage(message, true);
});

chatForm.addEventListener('submit', (e) => {
    const message = e.target.elements.messageToSend.value;
    e.preventDefault();
    socket.emit('message', message);
    createMessage(message, false);

});

locationButton.addEventListener('click', (e) => {
    if(!navigator.geolocation){
        return alert('You browser does not support this feature. :c');
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude,
        });
    });

});
