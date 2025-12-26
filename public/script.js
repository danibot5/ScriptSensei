const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    if (sender === 'user') {
        messageDiv.classList.add('user-message');
    } else {
        messageDiv.classList.add('bot-message');
    }

    messageDiv.innerText = text;
    chatHistory.appendChild(messageDiv);

    chatHistory.scrollTop = chatHistory.scrollHeight;
}

sendBtn.addEventListener('click', function() {
    const text = userInput.value;
    if (text.trim() === "") return;

    addMessage(text, 'user');
    userInput.value = '';

    setTimeout(function() {
        addMessage("Още не съм свързан с мозъка си (Firebase), но те чух: " + text, 'bot');
    }, 500);
});