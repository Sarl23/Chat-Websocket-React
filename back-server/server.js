const server = require("http").createServer();
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"]
});

io.on("connection", (socket) => {
  let userName;

  socket.on("join", (nomb) => {
    userName = nomb;
    //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
    socket.broadcast.emit("messages", {
      userName: userName,
      message: `${userName} ha entrado en la sala del chat`,
    });
  });

  socket.on("message", (userName, message) => {
    //io.emit manda el mensaje a todos los clientes conectados al chat
    io.emit("messages", { userName, message });
  });

  socket.on("disconnect", () => {
    io.emit("messages", {
      server: "Servidor",
      message: `${userName} ha abandonado la sala`,
    });
  });
});
server.listen(3000, () => console.log(`Server has started.`));
