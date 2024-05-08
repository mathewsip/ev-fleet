// script.js
function sendMessage() {
    var input = document.getElementById("user-input");
    var message = input.value.trim();
    if (message) {
        addMessage(message, 'user');
        input.value = "";
        // Simulate a bot response after a delay
        setTimeout(() => addMessage("Here's a simulated response!", 'bot'), 1200);
    }
}

function addMessage(text, sender) {
    var chatBox = document.getElementById("chat-box");
    var newMessage = document.createElement("div");
    newMessage.textContent = text;
    newMessage.className = sender === 'user' ? 'user-message' : 'bot-message';
    newMessage.style.margin = "5px";
    newMessage.style.padding = "10px";
    newMessage.style.background = sender === 'user' ? 'lightblue' : 'lightgrey';
    newMessage.style.borderRadius = "10px";
    newMessage.style.textAlign = sender === 'user' ? 'right' : 'left';
    chatBox.appendChild(newMessage);
    chatBox.scrollTop = chatBox.scrollHeight;
}
