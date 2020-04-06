const urlParams = new URLSearchParams(window.location.search);

let id = urlParams.get("id");

fetch (`/getUser/${id}`)
    .then(res => res.json())
    .then(data => {
        document.getElementById("flight").innerText = data.userData.flight;
        document.getElementById("seat").innerText = data.userData.seat;
        document.getElementById("name").innerText = `${data.userData.firstName} ${data.userData.lastName}`;
        document.getElementById("email").innerText = data.userData.email;
    })
