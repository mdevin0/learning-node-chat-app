const socket = io();

// Elements
const $chatArea = document.querySelector('#chatArea');
const $chatForm = document.querySelector('#chatForm');
const $sendButton = document.querySelector('#send');
const $locationButton = document.querySelector('#sendLocation');
const $chatList = document.querySelector('#chatList');

// Templates
const messageTemplate = document.querySelector('#messageTemplate').innerHTML;
const locationMessageTemplate = document.querySelector('#locationMessageTemplate').innerHTML;
const chatListTemplate = document.querySelector('#chatListTemplate').innerHTML;

// Options
const {user, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const createMessage = (message) => {
    const html = Mustache.render(messageTemplate, {
        user: message.user,
        text: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    });
    $chatArea.insertAdjacentHTML('beforeend', html);
};

const autoScroll = () => {
    // Get new message element
    const $newMessage = $chatArea.lastElementChild;

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $chatArea.offsetHeight;
    
    // Messages container height
    const containerHeight = $chatArea.scrollHeight;

    // How far has been scrolled?
    const scrollOffset = $chatArea.scrollTop + visibleHeight;

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $chatArea.scrollTop = $chatArea.scrollHeight;
    }


}

socket.on('message', (message) => {
    createMessage(message);
    autoScroll();
});

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate,  {
        user: message.user,
        text: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    });
    $chatArea.insertAdjacentHTML('beforeend', html);
    autoScroll();

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

socket.on('roomChanged', ({room, users}) => {
    const html = Mustache.render(chatListTemplate, {
        room,
        users
    });
    chatList.innerHTML = html;
});

socket.emit('join', {user, room}, (error) => {
    if(error){
        alert(error);
        return location.href = '/';
    }
});
