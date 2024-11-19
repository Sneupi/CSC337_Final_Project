document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const login = document.getElementById("login");
    const chatroom = document.getElementById("chatroom");
    const joinButton = document.getElementById("join");
    const sendButton = document.getElementById("send");
    const roomNameElem = document.getElementById("room-name");
    const userlistElem = document.getElementById("user-list");
    const messagesElem = document.getElementById("messages");
    const messageInput = document.getElementById("message");

    let username, room;

    joinButton.addEventListener("click", () => {
        username = document.getElementById("username").value.trim();
        room = document.getElementById("room").value.trim();

        if (username && room) {
            login.classList.add("hidden");
            chatroom.classList.remove("hidden");
            roomNameElem.textContent = `Room: ${room}`;
            socket.emit("joinRoom", { username, room });
        }
    });

    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit("chatMessage", message);
            messageInput.value = "";
        }
    }

    socket.on("message", (message) => {
        const div = document.createElement("div");
        div.textContent = message;
        messagesElem.appendChild(div);
        messagesElem.scrollTop = messagesElem.scrollHeight;
    });

    socket.on("updateUsers", (users) => {
        userlistElem.innerHTML = users.map((user) => `<li>${user.username}</li>`).join("");
    });
});
