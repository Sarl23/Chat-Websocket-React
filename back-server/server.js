const server = require("http").createServer();
const io = require("socket.io")(server, {
  transports: ["websocket", "polling"]
});

const users = {};
io.on("connection", (socket) => {
  console.log('Data connection');

  socket.on("join", (data) => {
    const {userName, pass} = data;
    console.log('data', data);
    const user = {
      name: userName,
      id: socket.id,
      pass: pass
    };

    users[socket.id] = user;

    io.emit("connected", user);
    /*if (user.pass === 'admin') io.emit("admin", user);*/
    io.emit("users", Object.values(users));
  });

  socket.on("message", (userName, message) => {
    //io.emit manda el mensaje a todos los clientes conectados al chat
    io.emit("messages", {userName, message});
  });

  socket.on("specificUser", (id) => {
    console.log('specificID', id);
    console.log(id, users);
    io.to('some room').emit('some event');

    //socket.broadcast.emit manda el mensaje a todos los clientes excepto al que ha enviado el mensaje
    /*
    socket.broadcast.emit("messages", {
      userName: userName,
      message: `${userName} Ha entrado a la Sala`,
    });
    * */
  });

  socket.on("disconnect", () => {
    const username = users[socket.id];
    io.emit("messages", {
      server: "Servidor",
      message: `${username} Ha abandonado la sala`,
    });
    delete users[socket.id];
    io.emit("exitUser", socket.id);
  });
});
server.listen(3000, () => console.log(`Server has started.`));
