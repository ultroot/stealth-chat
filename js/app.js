// 1. Separate Prompts for Room, Nickname, and PIN
let roomName = prompt("1. Enter a Chat Room Name (You and your friend must type the exact same name to connect):", "SecretRoom");
if (!roomName) roomName = "SecretRoom";

let myNickname = prompt("2. Enter your Nickname (This will show under your ghost emojis):", "Agent");
if (!myNickname) myNickname = "Agent";

let secretPin = prompt("3. Set your secret PIN to unlock messages:", "1234");
if (!secretPin) secretPin = "1234";

// Display the room name in the top right corner
document.getElementById("room-display").innerText = "Room: " + roomName;

const myId = Math.random().toString(36).substring(2, 10);

// Connect specifically to the private room
const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
const ws = new WebSocket(protocol + window.location.host + "/ws/" + encodeURIComponent(roomName));
const messagesDiv = document.getElementById("messages");
const disguises = ["👻", "👽", "👾", "🤖", "🎃", "🙈", "🕵️‍♂️", "🔒"];

ws.onmessage = function (event) {
    let data;
    try {
        data = JSON.parse(event.data);
    } catch (e) {
        data = { senderId: "unknown", nickname: "Unknown", text: event.data };
    }

    const msgElement = document.createElement("div");
    msgElement.classList.add("message");

    if (data.senderId === myId) {
        msgElement.classList.add("sent");
    } else {
        msgElement.classList.add("received");
    }

    msgElement.innerText = data.text;
    messagesDiv.appendChild(msgElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    // Pass the specific sender's nickname to the masking function
    setTimeout(() => {
        maskMessage(msgElement, data.text, data.nickname);
    }, 5000);
};

function maskMessage(element, text, senderNickname) {
    const randomEmoji = disguises[Math.floor(Math.random() * disguises.length)];

    // Display the user's nickname instead of "Unlock"
    element.innerHTML = randomEmoji + "<br><span class='unlock-btn'>" + senderNickname + "</span>";
    element.classList.add("stealth-mode");

    element.onclick = function () {
        const userPin = prompt("Enter PIN:");
        if (userPin === secretPin) {
            element.innerText = text;
            element.classList.remove("stealth-mode");
            element.onclick = null;

            // Hide it again and re-apply the correct nickname
            setTimeout(() => {
                maskMessage(element, text, senderNickname);
            }, 5000);
        } else if (userPin !== null) {
            alert("Incorrect PIN");
        }
    };
}

function sendMessage() {
    const input = document.getElementById("messageInput");
    if (input.value.trim() !== "") {
        // Send the nickname alongside the message
        const payload = {
            senderId: myId,
            nickname: myNickname,
            text: input.value
        };
        ws.send(JSON.stringify(payload));
        input.value = "";
    }
}

document.getElementById("messageInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});