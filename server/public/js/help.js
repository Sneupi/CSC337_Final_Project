let loggedIn = false;
let homeButton = document.getElementById("homeButton");
homeButton.addEventListener("click", function(e){
    window.location.href("./index.html");
});

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
window.addEventListener("load", function(e){
    console.log("help page loaded");
    userInfoReq.open("POST", "http://localhost:3000/api/userInfo");
    userInfoReq.send();
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

document.getElementById("homeButton").addEventListener("click", function(e){
    if(loggedIn){
        window.alert("Must log out to return home");
    }else{
        window.location = "./index.html";
    }
});
document.getElementById("chatButton").addEventListener("click", function(e){
    if(loggedIn){
        window.location = "./chatInstance.html";
    }else{
        window.alert("Must be logged in to chat");
    }
});