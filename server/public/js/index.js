
/*const dropdownButton = document.getElementById('selectedIcon');
const dropdownMenu = document.getElementById('dropdownMenu');
const items = document.querySelectorAll('.dropdown-item');
console.log(dropdownMenu.classList);
dropdownButton.addEventListener('click', () => {
    dropdownMenu.classList.toggle('open');
});

items.forEach(item => {
    item.addEventListener('click', () => {
        dropdownButton.innerHTML = item.innerHTML;
        dropdownButton.dataset.value = item.dataset.value; // Store selected value
        dropdownMenu.classList.remove('open');
    });
});

// Close the dropdown if clicked outside
document.addEventListener('click', (event) => {
    if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove('open');
    }
});*/

console.log("&#128213");

let helpButton = document.getElementById("qButton");
helpButton.addEventListener("click", function(e){
    window.location = "./helpPage.html";
});
const xmlLoginReq = new XMLHttpRequest();

xmlLoginReq.onreadystatechange = () => {
    console.log(xmlLoginReq.readyState);
    if (xmlLoginReq.readyState != 4){
        console.log("unready", xmlLoginReq.readyState);
        return;
    }
    let response = JSON.parse(xmlLoginReq.responseText);
    if (xmlLoginReq.status == 404) {
        console.log(404, response.message);
        if(response.message === 'Username currently in-use'){
            window.alert("Username currently in-use, pick another");
        }else{
            window.alert("Error: " + response.message);
        }
    }
    console.log("went through");
    if(response.message === 'Logged in successfully'){
        //switch page to rooms page
        window.location = "./chatRoom.html" //FIXME direct to room browser page
    }
}

document.getElementById("enterInput").addEventListener("click", function(e){
    let name = document.getElementById("userName").value;
    if(name === ""){
        window.alert("Enter name");
        return;
    }
    let icon = document.getElementById("userIcon").value;
    let room = document.getElementById("roomName").value;
    if(room === ""){
        window.alert("Enter room name");
        return;
    }
    xmlLoginReq.open("POST", "http://localhost:3000/api/login");
    xmlLoginReq.setRequestHeader("Content-Type", "application/json");
    xmlLoginReq.send(JSON.stringify({userName: name, userIcon: icon, roomName: room}));
});
