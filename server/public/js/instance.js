let loggedIn = false;
let rooms = [];
let userId = "";
//Gets user info to display in top right when page loads
const userInfoReq = new XMLHttpRequest();
userInfoReq.onreadystatechange = () => {
    if (userInfoReq.readyState != 4){
        return;
    }
    let usernameP = document.getElementById("usernameDip");
    let userIconP = document.getElementById("userIconDisp");
    if(userInfoReq.status == 404){
        console.log("Not logged in");
        usernameP.innerText = "Not logged in";
    }else{
        loggedIn = true;
        let response = JSON.parse(userInfoReq.responseText);
        usernameP.innerText = response.username;
        userIconP.innerHtml = "<i class='" + response.icon + "'></i>";
    }
}

const joinRoomReq = new XMLHttpRequest();
joinRoomReq.onreadystatechange = () => {
    if (joinRoomReq.readyState != 4){
        return;
    }
    let response = JSON.parse(joinRoomReq.responseText);
    if(joinRoomReq.status == 400){
        window.alert(response.message);
        console.log(response.message);
        return
    }
    if(joinRoomReq.status == 404){
        window.alert(response.message);
        console.log(reponse.message);
        return
    }
    if(joinRoomReq.status == 409){
        window.alert(response.message);
        console.log(response.message);
        return
    }
    if(joinRoomReq.status == 500){
        window.alert(response.message);
        console.log(response.message);
        return
    }
    if(joinRoomReq.status == 201){
        window.location = "./chatRoom.html";
    }
    console.log("Error joinRoomReq");
}

//Gets list of rooms to display and make available to join
const getRoomsReq = new XMLHttpRequest();
getRoomsReq.onreadystatechange = () => {
    if (getRoomsReq.readyState != 4){
        return;
    }
    let roomsDiv = document.getElementById("classWrapper");
    roomsDiv.innerHTML = "";
    let currDiv;
    let currButton;
    if(getRoomsReq.status == 500){
        currDiv = document.createElement("div");
        currDiv.innerHTML = "ERROR: could not retrieve chat rooms";
        roomsDiv.appendChild(currDiv);
        console.log(getRoomsReq.body.message);
    }else{
        let response = JSON.parse(getRoomsReq.responseText);
        if(response.message === "No rooms found"){
            currDiv = document.createElement("div");
            currDiv.innerHTML = "No rooms currently available, create a new chat room to get started!";
            roomsDiv.appendChild(currDiv);
            console.log("no rooms");
        }else{
            rooms = response.rooms;
            for(let i = 0; i < rooms.length; i++){
                currDiv = document.createElement("div");
                
                currDiv.style.display = "flex";
                currDiv.style.justifyContent = "center";
                currDiv.style.alignItems = "center";
                currDiv.style.flexDirection = "column";

                currDiv.innerText = rooms[i];
                currButton = document.createElement("button");
                currButton.innerText = "Join";
                currButton.addEventListener("click", function(e){
                    //add user to room
                    joinRoomReq.open("POST", "http://localhost:3000/api/rooms/" + rooms[i] + "/join");
                    joinRoomReq.send(userId);
                });
                currDiv.appendChild(currButton);
                roomsDiv.appendChild(currDiv);
            }
        }
    }
}

window.addEventListener("load", function(e){
    console.log("Instance page loaded");
    userInfoReq.open("GET", "http://localhost:3000/api/userInfo");
    userInfoReq.send();
    getRoomsReq.open("GET", "http://localhost:3000/api/rooms");
    getRoomsReq.send();
});

const makeRoomReq = new XMLHttpRequest();
makeRoomReq.onreadystatechange = () => {
    if (makeRoomReq.readyState != 4){
        return;
    }
    if(makeRoomReq.status == 400){
        window.alert("No room name given");
        console.log(makeRoomReq.body.message);
        return;
    }
    if(makeRoomReq.status == 500){
        window.alert("Error creating room");
        console.log(makeRoomReq.body.message);
        return;
    }
    if(makeRoomReq.status == 409){
        window.alert("Room already exists");
        console.log(makeRoomReq.body.message);
        return;
    }
    if(makeRoomReq.status == 405){
        window.alert("Cannot create any more rooms");
        console.log(makeRoomReq.body.message);
        return;
    }
    if(makeRoomReq.status == 201){
        getRoomsReq.open("GET", "http://localhost:3000/api/rooms");
        getRoomsReq.send();
    }
    console.log("error makeroomreq");
}

//Event listener for adding a room
document.getElementById("roomButton").addEventListener("click", function(e){
    if(document.getElementById("newRoom").value === ""){
        window.alert("Room must have a name to be created");
        return;
    }
    for(let i = 0; i < rooms.length; i++){
        if(rooms[i] === document.getElementById("newRoom").value){
            window.alert("Room name already exists");
            return;
        }
    }
    createRoomReq.open("POST", 'http://localhost:3000/api/rooms');
    createRoomsReq.send(document.getElementById("newRoom").value);
});

//Logs user out and returns home if successful
const logoutReq = new XMLHttpRequest();
logoutReq.onreadystatechange = () => {
    if (logoutReq.readyState != 4){
        return;
    }
    if(logoutReq.status == 404){
        console.log("404: ");
        window.alert("Error logging out");
    }else{
        window.alert("Log out successful");
        window.location = "./index.html";
    }
}
document.getElementById("logOut").addEventListener("click", function(e){
    console.log("Attempting log out");
    logoutReq.open("POST", "http://localhost:3000/api/logout");
    logoutReq.send();
});

// Help Button
let helpButton = document.getElementById("qButton");
helpButton.addEventListener("click", function(e){
    window.location = "./helpPage.html";
});
// Home Button
document.getElementById("homeButton").addEventListener("click", function(e){
    if(loggedIn){
        window.location = "./chatInstance.html";
    }else{
        window.location = "./index.html";
    }
});
// Chatroom button
document.getElementById("chatButton").addEventListener("click", function(e){
    if(loggedIn){
        window.location = "./chatRoom.html";
    }else{
        window.alert("Must be logged in to chat");
    }
});