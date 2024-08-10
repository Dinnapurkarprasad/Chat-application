const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    let userName = '';

    // Prompt the user to enter their name
    while (!userName) {
        userName = prompt('Enter your name:');
    }

    // Emit the new user event with the entered userName
    socket.emit('new-user', userName);

    const sendBtn = document.getElementById("sendbtn");
    const messageInput = document.getElementById("message");
    const allMessages = document.getElementById("msg");

    // Handle incoming messages
    socket.on("message", ({ message, type, userName: senderName }) => {
        const p = document.createElement('p');
        p.classList.add('message');

        if (type === 'incoming') {
            p.classList.add('incoming');
            p.innerText = `${senderName}: ${message}`;
        } else if (type === 'outgoing') {
            p.classList.add('outgoing');
            p.innerText = `You: ${message}`;
        } else if (type === 'notification') {
            p.classList.add('notification');
            p.innerText = message;
        }

        allMessages.appendChild(p);
        allMessages.scrollTop = allMessages.scrollHeight;
    });

    // Send message on button click
    sendBtn.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message !== '') {
            // Send the message to the server
            socket.emit('user-message', message);
            messageInput.value = '';  // Clear input field
        }
    });
});
