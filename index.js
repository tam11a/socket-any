const express = require("express");
const app = express();
const cors = require("cors");
const server = require("http").Server(app);
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const wss = new WebSocket.Server({
  server,
});

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// ws(websocket)
wss.on("connection", (ws, request, client) => {
  console.log("connected ", client);

  ws.on("message", (data) => {
    console.log("received: %s", data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(String(data));
      }
    });
  });
});

// io(socket.io)
io.on("connection", (socket) => {
  console.log(socket.id, "connected");

  socket.onAny((eventName, data) => {
    console.log(data);
    io.emit(eventName, data);
  });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
