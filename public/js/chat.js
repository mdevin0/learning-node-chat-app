const socket = io();

// Elements
const $chatArea = document.querySelector('#chatArea');
const $chatForm = document.querySelector('#chatForm');
const $sendButton = document.querySelector('#send');
const $locationButton = document.querySelector('#sendLocation');

// 
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessageTemplate').innerHTML;

const createMessage = (message) => {
    const html = Mustache.render(messageTemplate, {
        text: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    });
    $chatArea.insertAdjacentHTML('beforeend', html);
}

socket.on('message', (message) => {
    createMessage(message);
});

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate,  {
        text: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    });
    $chatArea.insertAdjacentHTML('beforeend', html);

});

$chatForm.addEventListener('submit', (e) => {
    const message = e.target.elements.messageToSend.value;
    e.preventDefault();
    $sendButton.setAttribute('disabled', 'disabled');
    $chatForm.elements.messageToSend.value = '';
    $chatForm.elements.messageToSend.focus();

    socket.emit('message', message, (error) => {
        $sendButton.removeAttribute('disabled');

        if(error){
            return console.log(error);
        }
        console.log('Message delivered!');
        createMessage(message);
    });

});

$locationButton.addEventListener('click', (e) => {
    if(!navigator.geolocation){
        return alert('You browser does not support this feature. :c');
    }
    $locationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude,
        }, () => {
            $locationButton.removeAttribute('disabled');
            console.log('Location shared!');
        });
    });

});
