const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

// ВНИМАНИЕ: Тук сложихме твоя линк от снимката!
const API_URL = 'http://127.0.0.1:5001/scriptsensei-4e8fe/us-central1/chat';

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

sendBtn.addEventListener('click', async function () {
    const text = userInput.value;
    if (text.trim() === "") return;

    // 1. Показваме въпроса веднага
    addMessage(text, 'user');
    userInput.value = '';

    // 2. Пращаме го към AI сървъра
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        // Проверка: Ако има отговор, го покажи. Ако има грешка - покажи нея.
        if (data.reply) {
            addMessage(data.reply, 'bot');
        } else if (data.error) {
            addMessage("🚨 " + data.error, 'bot');
        } else {
            addMessage("Нещо странно се случи (undefined).", 'bot');
        }

    } catch (error) {
        addMessage("Грешка: Сървърът не отговаря.", 'bot');
    }
});