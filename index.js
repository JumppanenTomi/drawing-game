const Server = require("socket.io");

const io = new Server({});

io.on("connection", (socket) => {
    socket.on("disconnect", (reason) => {
        console.log(reason);
      });
});

io.listen(3000);