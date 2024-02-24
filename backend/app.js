const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const PORT = 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

const nameToSocketIdMap = new Map();
const socketIdToNameMap = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected");

  socket.on("roomCreateJoin", (data) => {
    console.log(data);
    let { name, id } = data;
    nameToSocketIdMap.set(name, socket.id);
    socketIdToNameMap.set(socket.id, name);
    io.to(id).emit("user:joined", { name, id: socket.id });
    socket.join(id);
    io.to(socket.id).emit("roomCreateJoin", data);
  });

  socket.on("userCall", ({ to, offer }) => {
    io.to(to).emit("incommingCall", { from: socket.id, offer });
  });

  socket.on("callAccepted", ({ to, ans }) => {
    io.to(to).emit("callAccepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    console.log("peer:nego:needed", offer);
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    console.log("peer:nego:done", ans);
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });

  socket.on("callEnded", ({ to }) => {
    console.log(`Received callEnded signal from ${socket.id} to ${to}`);

    if (to) {
      // Broadcast the callEnded signal to the other user in the room
      io.to(to).emit("callEnded", { from: socket.id });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
