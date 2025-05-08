// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Load initial chat history and databases
    populateChatHistory();
});

function sendMessage() {
    const input = document.getElementById("user-input");
    const message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        input.value = "";
        setTimeout(() => addMessage("This is an automated response.", 'bot'), 1000);
    }
}

function addMessage(text, sender) {
    const chatBox = document.getElementById("chat-box");
    const newMessage = document.createElement("div");
    newMessage.textContent = text;
    newMessage.className = sender === 'user' ? 'chat-message user-message' : 'chat-message bot-message';
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function startNewChat() {
    document.getElementById("chat-box").innerHTML = '';  // Clear the chat box
    // Optionally, add new chat to history
}

function populateChatHistory() {
    const chatHistory = document.getElementById("chat-history");
    // This is where you could fetch and display past chat sessions
    const exampleChat = document.createElement("button");
    exampleChat.className = 'list-group-item list-group-item-action';
    exampleChat.textContent = 'Previous Chat - ' + new Date().toLocaleDateString();
    chatHistory.appendChild(exampleChat);
}
