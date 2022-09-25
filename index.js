const express = require('express')
const app = express()
const http = require('http')
const path=require('path')
const server = http.createServer(app)
const Server = require("socket.io")
const io=new Server(server)

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {

    socket.on('logUser', data => {
        setUsername(data)
        socket.join("roomList")
        socket.leave(String(socket.id))
        returnRooms()
    })

    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('createRoom', data => {
        socket.join(data);
    })

    function setUsername(username) {
        socket.username=username;
        return;
    }

    function returnRooms() {
        io.to('roomList').emit('listOfRooms', JSON.stringify(io.sockets.adapter.rooms))
    }

});

server.listen(3000, () => {
  console.log('listening on *:3000')
});