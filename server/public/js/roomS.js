let loggedIn = false;
let userId = "";
let roomId = "";
let usersInRoom = [];

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
    let usernameP = document.getElementById("userNameDisp");
    let userIconP = document.getElementById("userIconDisp");
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
        usernameP.innerText = userId;
        userIconP.innerHtml = "<i class='" + JSON.parse(userInfoReq.responseText).userIcon + "'></i>";
    }
}

function loadRoom(){

}

window.addEventListener("load", function(e){
    console.log("Instance page loaded");
    userInfoReq.open("GET", "http://localhost:3000/api/userInfo");
    userInfoReq.send();
});