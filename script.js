// script.js
function sendMessage() {
    var input = document.getElementById("user-input");
    var message = input.value.trim();
    if (message) {
        var chatBox = document.getElementById("chat-box");
        var newMessage = document.createElement("div");
        newMessage.textContent = message;
        newMessage.style.margin = "5px";
        newMessage.style.padding = "10px";
        newMessage.style.background = "lightblue";
        newMessage.style.borderRadius = "10px";
        chatBox.appendChild(newMessage);
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
}
