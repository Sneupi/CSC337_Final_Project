let loggedIn = false;
let userId = "";
let userIcon = "";
let roomId = "";
let usersInRoom = [];

const sendLogoutReq = new XMLHttpRequest();
sendLogoutReq.onreadystatechange = () => {
    if(sendLogoutReq.readyState != 4){
        return;
    }
    if(sendLogoutReq.status == 404){
        window.alert(response.message);
        console.log(response.message);
        return;
    }
    if(sendLogoutReq.status == 200){
        window.location = "./index.html";
    }
}
document.getElementById("logOut").addEventListener("click", function(e){
    sendLogoutReq.open("POST", "http://localhost:3000/api/logout");
    sendLogoutReq.send();
});

const sendMessageReq = new XMLHttpRequest();
sendMessageReq.onreadystatechange = () => {
    if(sendMessageReq.readyState != 4){
        return;
    }
    let response = JSON.parse(sendMessageReq.responseText);
    if(sendMessageReq.status == 404 || sendMessageReq.status == 500 || sendMessageReq.status == 400){
        window.alert(response.message);
        console.log(response.message);
        return;
    }
    if(sendMessageReq.status == 201){
        console.log("message sent successfully");
        roomMessagesReq.open("GET", "http://localhost:3000/api/rooms/" + roomId + "/messages");
        roomMessagesReq.send();
    }
    console.log("error roomMessagesReq");
}

const roomMessagesReq = new XMLHttpRequest();
roomMessagesReq.onreadystatechange = () => {
    if(roomMessagesReq.readyState != 4){
        return;
    }
    let response = JSON.parse(roomMessagesReq.responseText);
    if(roomMessagesReq.status == 404 || roomMessagesReq.status == 500){
        window.alert(response.message);
        console.log(response.message);
        return;
    }
    if(roomMessagesReq.status == 200){
        let messages = response.messages;
        let messageDisplay = document.getElementById("chat");
        let str = "Existing chat:\n";
        for(let i = 0; i < messages.length; i++){
            str += messages[i].timestamp;
            str += " - ";
            str += messages[i].user;
            str += messages[i].userIcon;
            str += ": ";
            str += messages[i].content;
            str += "\n";
        }
        messageDisplay.innerText = str;
        return;
    }
    console.log("error roomMessagesReq");
}

const roomUsersReq = new XMLHttpRequest();
roomUsersReq.onreadystatechange = () => {
    if (roomUsersReq.readyState != 4){
        return;
    }
    if(roomUsersReq.status == 500){
        window.alert(JSON.parse(roomUsersReq.responseText).message);
        console.log(JSON.parse(roomUsersReq.responseText).message);
        return;
    }
    if(roomUsersReq.status == 404){
        window.alert(JSON.parse(roomUsersReq.responseText).message);
        console.log(JSON.parse(roomUsersReq.responseText).message);
        return;
    }
    if(roomUsersReq.status == 200){
        usersInRoom = JSON.parse(roomUsersReq.responseText).activeUsers;
        let usersDisp = document.getElementById("userList");
        let currLI;
        for(let i = 0; i < usersInRoom.length; i++){
            currLI = document.createElement("li");
            currLI.innerText = usersInRoom[i];
            usersDisp.appendChild(currLI);
        }
        return;
    }
    console.log("error roomUsersReq");
}

//Gets user info to display in top right when page loads
const userInfoReq = new XMLHttpRequest();
userInfoReq.onreadystatechange = () => {
    if (userInfoReq.readyState != 4){
        return;
    }
    let usernameP = document.getElementById("usernameDisp");
    let userIconP = document.getElementById("iconDisp");
    if(userInfoReq.status == 404){
        console.log("Not logged in");
        usernameP.innerText = "Not logged in";
        window.alert("Must be logged in to view chatrooms");
        window.location = "./index.html";
        return;
    }
    if(userInfoReq.status == 500){
        window.alert(JSON.parse(userInfoReq.responseText).message);
        console.log(JSON.parse(userInfoReq.responseText).message);
        return
    }
    if(userInfoReq.status == 200){
        loggedIn = true;
        userId = JSON.parse(userInfoReq.responseText).username;
        userIcon = JSON.parse(userInfoReq.responseText).icon;
        usernameP.innerText = userId;
        userIconP.innerHTML = "<i class='" + userIcon + "'></i>";
        roomId = JSON.parse(userInfoReq.responseText).room;
        console.log("set room id: ", roomId);
        loadRoomInfo();
        //document.getElementById("userChat").innerText = userId + userIcon +  ": ";
    }
}

function loadRoomInfo(){
    console.log("opening with roomid: ", roomId);
    roomUsersReq.open("GET", "http://localhost:3000/api/rooms/" + roomId + "/users");
    roomUsersReq.send();
    roomMessagesReq.open("GET", "http://localhost:3000/api/rooms/" + roomId + "/messages");
    roomMessagesReq.send();
}

window.addEventListener("load", function(e){
    console.log("Instance page loaded");
    userInfoReq.open("GET", "http://localhost:3000/api/userInfo");
    userInfoReq.send();
});

document.getElementById("enterButton").addEventListener("click", function(e){
    sendMessageReq.open("POST", "http://localhost:3000/api/rooms/" + roomId + "/messages");
    sendMessageReq.setRequestHeader("Content-Type", "application/json");
    console.log(document.getElementById("userChat").innerText);
    console.log(userId);
    sendMessageReq.send(JSON.stringify({userId: userId, content: document.getElementById("userChat").innerText}));
    document.getElementById("userChat").innerText = "";
    loadRoomInfo();
});