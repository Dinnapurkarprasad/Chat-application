const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    // When a new user joins
    socket.on('new-user', (userName) => {
        socket.userName = userName;
        // Notify all other users that a new user has joined
        socket.broadcast.emit('message', { message: `${userName} has joined the chat`, type: 'notification' });
    });

    // When a user sends a message
    socket.on('user-message', (message) => {
        const userName = socket.userName || 'Unknown';
        const data = { message, userName, type: 'incoming' };
        // Broadcast the message to all other users
        socket.broadcast.emit('message', data);
        // Also send the message back to the sender as an outgoing message
        socket.emit('message', { message, type: 'outgoing', userName });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        if (socket.userName) {
            io.emit('message', { message: `${socket.userName} has left the chat`, type: 'notification' });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
