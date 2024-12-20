let loggedIn = false;
let homeButton = document.getElementById("homeButton");
homeButton.addEventListener("click", function(e){
    window.location.href("./index.html");
});

//Gets user info to display in top right when page loads
const userInfoReq = new XMLHttpRequest();
userInfoReq.withCredentials = true;
userInfoReq.onreadystatechange = () => {
    if (userInfoReq.readyState != 4){
        return;
    }
    let usernameP = document.getElementById("userNameDisp");
    let userIconP = document.getElementById("userIconDisp");
    if(userInfoReq.status == 404){
        console.log(userInfoReq.responseText);
        usernameP.innerText = "Not logged in";
    }else{
        loggedIn = true;
        let response = JSON.parse(userInfoReq.responseText);
        usernameP.innerText = response.username;
        userIconP.innerHtml = "<i class='" + response.icon + "'></i>";
    }
}
window.addEventListener("load", function(e){
    console.log("help page loaded");
    userInfoReq.open("GET", "http://209.38.144.139:3000/api/userInfo");
    userInfoReq.send();
});

//Logs user out and returns home if successful
const logoutReq = new XMLHttpRequest();
logoutReq.withCredentials = true;
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
    logoutReq.open("POST", "http://209.38.144.139:3000/api/logout");
    logoutReq.send();
});

document.getElementById("homeButton").addEventListener("click", function(e){
    if(loggedIn){
        window.location = "./chatInstance.html";
    }else{
        window.location = "./index.html";
    }
});
document.getElementById("chatButton").addEventListener("click", function(e){
    if(loggedIn){
        window.location = "./chatRoom.html";
    }else{
        window.alert("Must be logged in to chat");
    }
});