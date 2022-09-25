const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', socket => {
    while (1==1) {
        console.log("fjds")
        io.emit("hello", "world");
    }
});
server.listen(3000);