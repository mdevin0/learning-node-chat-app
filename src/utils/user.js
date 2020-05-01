const users = [];

const addUser = ({id, user: name, room}) => {
    if(!name || !room){
        return {
            error: 'Username and room are required!'
        };
    }
    
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if(name === 'server'){
        return {
            error: "You can't pick the name 'server'"
        };
    }

    const existingUser = users.find((u) => {
        return u.room === room && u.name == name;
    });

    if(existingUser){
        return {
            error: 'Username is already in use!'
        };
    }

    const newUser = {id, name: name, room};
    users.push(newUser);
    return {user: newUser};

};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id = id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
    return users.find((user) => user.id === id);
};

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
};