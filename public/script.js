// ==========================================
// AI ЧАТ БОТ
// ==========================================

const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');

// ВНИМАНИЕ: Тук сложихме твоя линк от снимката!
const API_URL = 'http://127.0.0.1:5001/scriptsensei-4e8fe/us-central1/chat';

function addMessage(text, sender) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('message-row');

    if (sender === 'user') {
        rowDiv.classList.add('user-row');

        // Потребителят има само балонче
        const bubble = document.createElement('div');
        bubble.classList.add('user-bubble');
        bubble.innerText = text;
        rowDiv.appendChild(bubble);

    } else {
        rowDiv.classList.add('bot-row');

        const avatarImg = document.createElement('img');
        avatarImg.src = 'https://robohash.org/scriptsensei?set=set1&bgset=bg1&size=100x100';
        avatarImg.classList.add('avatar');

        const textDiv = document.createElement('div');
        textDiv.classList.add('bot-text');

        // ТУК Е ПРОМЯНАТА: Директно и чисто
        // marked.parse превръща **текст** в <strong>текст</strong>
        textDiv.innerHTML = marked.parse(text);

        // Логика за бутона "Сложи в редактора"
        if (text.includes('```')) {
            const codeMatch = text.match(/```(?:javascript|js)?\s*([\s\S]*?)```/i);
            if (codeMatch && codeMatch[1]) {
                const cleanCode = codeMatch[1].trim();
                const runCodeBtn = document.createElement('button');
                runCodeBtn.innerText = "⚡ Сложи в редактора";
                runCodeBtn.className = "code-btn";

                runCodeBtn.onclick = function () {
                    document.getElementById('code-editor').value = cleanCode;
                };
                textDiv.appendChild(runCodeBtn); // Слагаме бутона директно
            }
        }

        rowDiv.appendChild(avatarImg);
        rowDiv.appendChild(textDiv);
    }

    chatHistory.appendChild(rowDiv);
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


// ==========================================
// КОД ЕДИТОР И КОНЗОЛА
// ==========================================

const codeEditor = document.getElementById('code-editor');
const runBtn = document.getElementById('run-btn');
const outputBox = document.getElementById('console-output');

runBtn.addEventListener('click', function () {
    // 1. Взимаме кода, който си написал
    const userCode = codeEditor.value;

    // 2. Изчистваме старото съдържание на конзолата
    outputBox.innerHTML = '';

    try {
        // --- МАГИЯ: Пренасочване на console.log ---
        // Запазваме оригиналната конзола (за да не счупим браузъра)
        const originalConsoleLog = console.log;

        // Казваме на JS: "Когато някой напише console.log, не го печатай в скритата конзола, а го покажи в нашата кутия!"
        console.log = function (message) {
            // Добавяме съобщението в сивата кутия
            outputBox.innerHTML += `<div>> ${message}</div>`;
            // И все пак го пускаме и в скритата конзола (за всеки случай)
            originalConsoleLog(message);
        };

        // 3. Изпълняваме кода на потребителя!
        // "new Function" създава истинска функция от текст и я пуска
        new Function(userCode)();

        // Връщаме нормалната конзола, след като приключим
        console.log = originalConsoleLog;

    } catch (error) {
        // Ако има грешка в кода, я показваме в червено
        outputBox.innerHTML = `<div style="color: #ff4444;">🚨 Грешка: ${error.message}</div>`;
    }
});