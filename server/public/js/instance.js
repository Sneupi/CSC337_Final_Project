let loggedIn = false;
let rooms = [];
let userId = "";
//Gets user info to display in top right when page loads
const userInfoReq = new XMLHttpRequest();
userInfoReq.onreadystatechange = () => {
    if (userInfoReq.readyState != 4){
        return;
    }
    let usernameP = document.getElementById("userNameDisp");
    let userIconP = document.getElementById("userIconDisp");
    if(userInfoReq.status == 404){
        console.log("Not logged in");
        usernameP.innerText = "Not logged in";
    }else{
        loggedIn = true;
        usernameP.innerText = JSON.parse(userInfoReq.responseText).username;
        userIconP.innerHtml = "<i class='" + JSON.parse(userInfoReq.responseText).userIcon + "'></i>";
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
        if(getRoomsReq.body.message === "No rooms found"){
            currDiv = document.createElement("div");
            currDiv.innerHTML = "No rooms currently available, create a new chat room to get started!";
            roomsDiv.appendChild(currDiv);
            console.log("no rooms");
        }else{
            rooms = getRoomsReq.body.rooms;
            for(let i = 0; i < rooms.length; i++){
                currDiv = document.createElement("div");
                currDiv.innerText = room[i];
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
