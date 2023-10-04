document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://127.0.0.1:5000');

    const usernamePage = document.getElementById('username-page');
    const chatPage = document.getElementById('chat-page');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const messagesList = document.getElementById('messages-list');
    const usernameInput = document.getElementById('username-input');
    const usernameSubmitBtn = document.getElementById('username-submit');
    const chatUsername = document.getElementById('chat-username');
    const reactionButtons = document.querySelectorAll('.reaction');

    let username = '';


    usernameSubmitBtn.addEventListener('click', (event) => {
        event.preventDefault();
        username = usernameInput.value.trim();
        if (username) {
            usernamePage.classList.add('hidden');
            chatPage.classList.remove('hidden');
            chatUsername.textContent = username;
            usernameInput.value = ''; // Clear username input
        } else {
            alert('Please enter a valid username.');
        }
    });

    reactionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reaction = button.dataset.reaction;
            socket.emit('reaction', { username, reaction });
        });
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            const timestamp = new Date().toLocaleTimeString();
            socket.emit('message', { username, message, timestamp });
            messageInput.value = ''; // Clear message input
        }
    });

    socket.on('connect', () => {
        if (username) {
            usernameInput.value = username;
        }
    });

    socket.on('message', (data) => {
        const messageItem = document.createElement('li');
        if (data.username === username) {
            messageItem.classList.add('sent-message');
            messageItem.innerHTML = `<strong>You (${data.timestamp}):</strong> ${data.message}`;
        } else {
            messageItem.classList.add('received-message');
            messageItem.innerHTML = `<strong>${data.username} (${data.timestamp}):</strong> ${data.message}`;
        }
        messagesList.appendChild(messageItem);

        // Auto-scroll to the latest message
        messagesList.scrollTop = messagesList.scrollHeight;
    });

    socket.on('reaction', (data) => {
        const reactionItem = document.createElement('li');
        reactionItem.innerText = `${data.username} reacted with ${data.reaction}`;
        reactionItem.style.textAlign = 'center';
        reactionItem.style.color = '#ff8800';
        reactionItem.style.fontWeight = 'bold';
        messagesList.appendChild(reactionItem);


        // Auto-scroll to the latest reaction
        messagesList.scrollTop = messagesList.scrollHeight;
    });
});