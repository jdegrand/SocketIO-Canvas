var socket = io();

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

var lineColor = Math.floor(Math.random()*16777215).toString(16);
var mouseDown = false;
var lastMouseX = 0;
var lastMouseY = 0;

// Recieve from server
socket.on('draw', function(line) {
    drawFromSocket(line);
});

canvas.style.backgroundColor = "#d7f8ff";
canvas.addEventListener('mousemove', onMouseMove, false);
canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onUp, false);
canvas.addEventListener("touchmove", onTouchMove, false);
canvas.addEventListener("touchstart", onTouchDown, false);
canvas.addEventListener("touchend", onUp, false);

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener('resize', onResizeWindow);

function onMouseMove(e) {
    onMove(e.clientX, e.clientY);
}

function onTouchMove(e) {
    onMove(e.touches[0].clientX, e.touches[0].clientY);
}

function onMouseDown(e) {
    onDown(e.clientX, e.clientY);
}

function onTouchDown(e) {
    onDown(e.touches[0].clientX, e.touches[0].clientY);
}

function onMove(x, y) {
    if (mouseDown) {
        socket.emit('draw', {
            startX: lastMouseX,
            startY: lastMouseY,
            endX: x,
            endY: y,
            color: lineColor
        });
        lastMouseX = x;
        lastMouseY = y;
    }
};

function drawFromSocket(line) {
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = line.color;
    context.moveTo(line.startX, line.startY);
    context.lineTo(line.endX, line.endY)
    context.stroke();
    context.closePath();
};

function onDown(x, y) {
    mouseDown = true;
    lastMouseX = x;
    lastMouseY = y;
};

function onUp(e) {
    mouseDown = false;
};

function onResizeWindow() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    socket.emit('redraw');
};