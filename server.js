const express = require("express");
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const app = express();
const port = 8002;

const cors = require("cors");
var path = require('path');
app.set('port', 8002);

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
var server = require("http").Server(app);

const io = require("socket.io")(server);

io.on("connection", function(client) {
  //console.log("connected ----->")
  client.on("hi", e => {
    //console.log(e);
    io.emit("servermessage", "Message from server")
  });

  /*client.on("disconnect", function() {
    //console.log("user disconnected")
  });*/
});

server.listen(port, () =>
  //console.log(`Example app listening on port ${port}!`)
);
