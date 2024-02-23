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


io.on('connection', (socket) => {

  

})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
