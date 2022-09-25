var socket=io();

socket.emit('logUser', 'Tomi Jumppanen')

socket.on('listOfRooms', data => {
    ok(data)
})