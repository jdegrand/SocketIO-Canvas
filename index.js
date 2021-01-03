var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var lines = [];
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket) => {
  console.log('A client connected');
  drawAllLines(socket);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  socket.on('draw', (line) => {
    lines.push(line);
    io.emit('draw', line);
  });
  socket.on('redraw', (line) => {
    drawAllLines(socket);
  });
});

function drawAllLines(socket) {
  lines.forEach(line => {
    socket.emit('draw', line);
  });
}

http.listen(3000, () => {
  console.log('Listening on port3000');
});
