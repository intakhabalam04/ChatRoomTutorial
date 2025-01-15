var stompClient = null;
var otp = null;  // Global variable to store OTP

function sendMessage() {
    let jsonOb = {
        name: localStorage.getItem("name"),
        content: document.getElementById("message-value").value
    }

    stompClient.send(`/app/message/${otp}`, {}, JSON.stringify(jsonOb));  // Send message to OTP-specific room

    document.getElementById("message-value").value = "";
}

function connect() {
    let socket = new SockJS("/websocket-server-production-9664.up.railway.app");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log("Connected : " + frame);
        document.getElementById("name-from").classList.add('d-none');
        document.getElementById("chat-room").classList.remove('d-none');

        // Subscribe to the OTP-specific topic
        stompClient.subscribe(`/topic/return-to/${otp}`, function (response) {
            showMessage(JSON.parse(response.body));
        });

        // Notify others that the user has joined the chat
        let name = localStorage.getItem("name");
        let joinMessage = {
            name: name,
            content: `${name} has joined the chat!`
        };
        stompClient.send(`/app/user-joined/${otp}`, {}, JSON.stringify(joinMessage));
    });
}

function showMessage(message) {
    let messageContainer = document.getElementById("message-container-table");
    let newMessageRow = document.createElement("tr");
    let newMessageCell = document.createElement("td");

    // Check if the message is a system message (user joining)
    if (message.content.includes("has joined the chat!")) {
        newMessageCell.innerHTML = `<i>${message.content}</i>`;
    } else {
        newMessageCell.innerHTML = `<b>${message.name} :</b> ${message.content}`;
    }

    newMessageRow.appendChild(newMessageCell);
    messageContainer.prepend(newMessageRow);
}


document.addEventListener("DOMContentLoaded", (e) => {
    document.getElementById("login").addEventListener("click", () => {
        let name = document.getElementById("name-value").value;
        otp = document.getElementById("otp-value").value;  // Get OTP value
        localStorage.setItem("name", name);

        if (otp && name) {  
            document.getElementById("name-title").innerHTML = `Welcome, <b>${name}</b> (OTP: ${otp})`;
            connect();
        } else {
            alert("Please enter both Name and OTP to join the chat.");
        }
    });

    document.getElementById("send-btn").addEventListener("click", () => {
        sendMessage();
    });

    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("name");
        if (stompClient !== null) {
            stompClient.disconnect();

            document.getElementById("name-from").classList.remove('d-none');
            document.getElementById("chat-room").classList.add('d-none');
            console.log(stompClient);
        }
    });
});
