const flightInput = document.getElementById('flight');
const seatsDiv = document.getElementById('seats-section');
const confirmButton = document.getElementById('confirm-button');
const reservation = document.getElementById("reservation");

let firstName = "";
let lastName = "";
let email = "";
let flight = "";
let selectedSeat = "";

let selection = '';

fetch("/getFlights")
    .then(res => res.json())
    .then(data => {
        const { flights } = data;
        
        flights.forEach(flight => {
            const flightInfo = `<option value=${flight}>${flight}</option>`;
            let option = document.createElement("option");
            option.innerHTML = flightInfo; 
            document.getElementById("flight").appendChild(option);
        })
    })

const renderSeats = (seats) => {
    document.querySelector('.form-container').style.display = 'block';

    seatsDiv.innerHTML = "";
    
    const alpha = ['A', 'B', 'C', 'D', 'E', 'F'];

    for (let r = 1; r < 11; r++) {
        const row = document.createElement('ol');
        row.classList.add('row');
        row.classList.add('fuselage');
        seatsDiv.appendChild(row);
        for (let s = 1; s < 7; s++) {
            const seatNumber = `${r}${alpha[s-1]}`;
            const seat = document.createElement('li');
            const seatOccupied = `<li><label class="seat"><span id="${seatNumber}" class="occupied">${seatNumber}</span></label></li>`;
            const seatAvailable = `<li><label class="seat"><input type="radio" name="seat" value="${seatNumber}" /><span id="${seatNumber}" class="avail">${seatNumber}</span></label></li>`;      
            
            
            const status = seats.find(function(seating) {
                if (seating.id === seatNumber) {
                    return seating.isAvailable;
                }
            })
            
            if (status) {
                seat.innerHTML = seatAvailable;
            }
            else {
                seat.innerHTML = seatOccupied;
            }
            
            row.appendChild(seat);
            rendered = true;
        }
    }
    
    let seatMap = document.forms['seats'].elements['seat'];
    seatMap.forEach(seat => {
        seat.onclick = () => {
            selection = seat.value;
            selectedSeat = selection;
            seatMap.forEach(x => {
                if (x.value !== seat.value) {
                    document.getElementById(x.value).classList.remove('selected');
                }
            })
            document.getElementById(seat.value).classList.add('selected');
            document.getElementById('seat-number').innerText = ` (${selection})`;
            confirmButton.disabled = false;
        }
    });
}


const toggleFormContent = (event) => {
    let flightNumber = flightInput.value;

    flight = flightNumber;

    fetch(`/validate-flight/${flightNumber}`)
        .then(res => res.json())
        .then(data => {
            const seats = data;
            
            renderSeats(seats);
        })
}

const handleSearch = (event) => {
    event.preventDefault();
    
    fetch(`/getReservation/${reservation.value}`)
        .then(res => res.json())
        .then(data => data.id)
        .then (userID => window.location.href = `http://localhost:8000/seat-select/confirmed.html?id=${userID}`)
}

const handleConfirmSeat = (event) => {
    event.preventDefault();
    
    firstName = `${document.getElementById("givenName").value}`;
    lastName = `${document.getElementById("surname").value}`;
    email = `${document.getElementById("email").value}`;

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        flight: flight,
        seat: selectedSeat
    }

    fetch("/createUser", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
            'Accept': 'application/json',
        "Content-Type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => data.id)
        .then (userID => window.location.href = `http://localhost:8000/seat-select/confirmed.html?id=${userID}`)
}

flightInput.addEventListener('blur', toggleFormContent);