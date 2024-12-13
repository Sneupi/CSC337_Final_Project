let loggedIn = false;
let rooms = [];
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
        usernameP.innerText = userInfoReq.body.username;
        userIconP.innerHtml = "<i class='" + userInfoReq.body.userIcon + "'></i>";
    }
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
                    window.location - "./chatRoom.html";
                });
                currDiv.appendChild(currButton);
                roomsDiv.appendChild(currDiv);
            }
        }
    }
}

window.addEventListener("load", function(e){
    console.log("help page loaded");
    userInfoReq.open("POST", "http://localhost:3000/api/userInfo");
    userInfoReq.send();
    getRoomsReq.open("GET", "http://localhost:3000/api/rooms");
    getRoomsReq.send();
});

const RoomsReq = new XMLHttpRequest();
makeRoomReq.onreadystatechange = () => {
    if (makeRoomReq.readyState != 4){
        return;
    }
    if(makeRoomReq.status == 404){

    }else{
        
    }
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
