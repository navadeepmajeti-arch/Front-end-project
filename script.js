/* ================================
   EVENT DATA
================================ */

const events = [
    {
        id: 1,
        name: "Pushpa 2 Movie",
        category: "Movie",
        date: "10 October 2026",
        time: "6:30 PM",
        venue: "PVR Cinemas",
        price: 250,
        icon: "🎬"
    },

    {
        id: 2,
        name: "Music Festival 2026",
        category: "Concert",
        date: "15 October 2026",
        time: "7:00 PM",
        venue: "Vijayawada Stadium",
        price: 800,
        icon: "🎵"
    },

    {
        id: 3,
        name: "Cricket Championship",
        category: "Sports",
        date: "20 October 2026",
        time: "5:00 PM",
        venue: "ACA Stadium",
        price: 600,
        icon: "🏏"
    },

    {
        id: 4,
        name: "Stand Up Comedy",
        category: "Comedy",
        date: "25 October 2026",
        time: "8:00 PM",
        venue: "City Convention Hall",
        price: 400,
        icon: "😂"
    }
];


/* ================================
   GLOBAL VARIABLES
================================ */

let currentEvent = null;

let selectedSeats = [];


/* ================================
   PAGE LOAD
================================ */

document.addEventListener("DOMContentLoaded", function () {

    displayEvents();

    displayBookings();

    displayUser();

});


/* ================================
   DISPLAY EVENTS
================================ */

function displayEvents() {

    const container =
        document.getElementById("eventContainer");

    const search =
        document.getElementById("searchBox").value.toLowerCase();

    container.innerHTML = "";

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(search) ||
        event.category.toLowerCase().includes(search)
    );


    filteredEvents.forEach(event => {

        const card = document.createElement("div");

        card.className = "event-card";

        card.innerHTML = `

            <div class="event-image">
                ${event.icon}
            </div>

            <h3>${event.name}</h3>

            <p><strong>Category:</strong> ${event.category}</p>

            <p><strong>Date:</strong> ${event.date}</p>

            <p><strong>Time:</strong> ${event.time}</p>

            <p><strong>Venue:</strong> ${event.venue}</p>

            <p><strong>Price:</strong> ₹${event.price}</p>

            <button onclick="openBooking(${event.id})">
                Book Now
            </button>
        `;

        container.appendChild(card);

    });

}


/* ================================
   OPEN BOOKING
================================ */

function openBooking(eventId) {

    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));

    if (!user) {

        alert("Please login before booking.");

        showSection("login");

        return;
    }


    currentEvent =
        events.find(event => event.id === eventId);


    selectedSeats = [];


    document.getElementById("selectedEvent").innerHTML = `

        <div class="booking-card">

            <h3>${currentEvent.name}</h3>

            <p>${currentEvent.date}</p>

            <p>${currentEvent.time}</p>

            <p>${currentEvent.venue}</p>

            <p>₹${currentEvent.price} per ticket</p>

        </div>
    `;


    createSeats();

    showSection("booking");

}


/* ================================
   CREATE SEATS
================================ */

function createSeats() {

    const container =
        document.getElementById("seatContainer");

    container.innerHTML = "";


    const bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    let bookedSeats = [];


    bookings.forEach(booking => {

        if (booking.eventId === currentEvent.id) {

            bookedSeats =
                bookedSeats.concat(booking.seats);

        }

    });


    for (let i = 1; i <= 20; i++) {

        const seat = document.createElement("div");

        const seatNumber = "S" + i;

        seat.className = "seat";

        seat.textContent = seatNumber;


        if (bookedSeats.includes(seatNumber)) {

            seat.classList.add("booked");

        } else {

            seat.onclick = function () {

                selectSeat(seatNumber, seat);

            };

        }


        container.appendChild(seat);

    }

}


/* ================================
   SELECT SEAT
================================ */

function selectSeat(seatNumber, seatElement) {

    if (selectedSeats.includes(seatNumber)) {

        selectedSeats =
            selectedSeats.filter(
                seat => seat !== seatNumber
            );

        seatElement.classList.remove("selected");

    } else {

        selectedSeats.push(seatNumber);

        seatElement.classList.add("selected");

    }


    updateBookingSummary();

}


/* ================================
   BOOKING SUMMARY
================================ */

function updateBookingSummary() {

    document.getElementById("selectedSeats").textContent =
        selectedSeats.length
            ? selectedSeats.join(", ")
            : "None";


    document.getElementById("ticketCount").textContent =
        selectedSeats.length;


    const total =
        selectedSeats.length * currentEvent.price;


    document.getElementById("totalPrice").textContent =
        total;

}


/* ================================
   CONFIRM BOOKING
================================ */

function confirmBooking() {

    if (selectedSeats.length === 0) {

        alert("Please select at least one seat.");

        return;
    }


    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));


    const booking = {

        bookingId:
            "TB" + Date.now(),

        userEmail:
            user.email,

        userName:
            user.name,

        eventId:
            currentEvent.id,

        eventName:
            currentEvent.name,

        date:
            currentEvent.date,

        time:
            currentEvent.time,

        venue:
            currentEvent.venue,

        seats:
            selectedSeats,

        tickets:
            selectedSeats.length,

        total:
            selectedSeats.length *
            currentEvent.price
    };


    let bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    bookings.push(booking);


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    generateTicket(booking);

    displayBookings();

}


/* ================================
   GENERATE DIGITAL TICKET
================================ */

function generateTicket(booking) {

    document.getElementById("ticketContainer").innerHTML = `

        <h2>🎟️ TicketBook</h2>

        <h3>${booking.eventName}</h3>

        <p>
            <strong>Booking ID:</strong>
            ${booking.bookingId}
        </p>

        <p>
            <strong>Name:</strong>
            ${booking.userName}
        </p>

        <p>
            <strong>Date:</strong>
            ${booking.date}
        </p>

        <p>
            <strong>Time:</strong>
            ${booking.time}
        </p>

        <p>
            <strong>Venue:</strong>
            ${booking.venue}
        </p>

        <p>
            <strong>Seats:</strong>
            ${booking.seats.join(", ")}
        </p>

        <p>
            <strong>Tickets:</strong>
            ${booking.tickets}
        </p>

        <p>
            <strong>Total:</strong>
            ₹${booking.total}
        </p>

        <h2>▦</h2>

        <p>Show this digital ticket at the venue.</p>

        <button onclick="window.print()">
            Print Ticket
        </button>
    `;


    showSection("ticket");

}


/* ================================
   SIGNUP
================================ */

function signupUser(event) {

    event.preventDefault();


    const name =
        document.getElementById("signupName").value;

    const email =
        document.getElementById("signupEmail").value;

    const phone =
        document.getElementById("signupPhone").value;

    const password =
        document.getElementById("signupPassword").value;

    const confirmPassword =
        document.getElementById("signupConfirmPassword").value;


    if (password !== confirmPassword) {

        document.getElementById("signupMessage").textContent =
            "Passwords do not match.";

        return;
    }


    let users =
        JSON.parse(localStorage.getItem("users")) || [];


    const existingUser =
        users.find(user => user.email === email);


    if (existingUser) {

        document.getElementById("signupMessage").textContent =
            "Email already registered.";

        return;
    }


    const newUser = {

        name,
        email,
        phone,
        password

    };


    users.push(newUser);


    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    document.getElementById("signupMessage").textContent =
        "Signup successful! You can now login.";

}


/* ================================
   LOGIN
================================ */

function loginUser(event) {

    event.preventDefault();


    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;


    const users =
        JSON.parse(localStorage.getItem("users")) || [];


    const user =
        users.find(
            user =>
                user.email === email &&
                user.password === password
        );


    if (!user) {

        document.getElementById("loginMessage").textContent =
            "Invalid email or password.";

        return;
    }


    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );


    document.getElementById("loginMessage").textContent =
        "Login successful!";


    displayUser();

    showSection("events");

}


/* ================================
   DISPLAY USER
================================ */

function displayUser() {

    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));


    const display =
        document.getElementById("userDisplay");


    if (user) {

        display.innerHTML = `
            Welcome, ${user.name}
            <button onclick="logoutUser()">
                Logout
            </button>
        `;

    } else {

        display.textContent = "";

    }

}


/* ================================
   LOGOUT
================================ */

function logoutUser() {

    localStorage.removeItem("loggedInUser");

    displayUser();

    alert("Logged out successfully.");

}


/* ================================
   DISPLAY BOOKINGS
================================ */

function displayBookings() {

    const container =
        document.getElementById("bookingContainer");


    const user =
        JSON.parse(localStorage.getItem("loggedInUser"));


    if (!user) {

        container.innerHTML = `
            <p style="text-align:center">
                Please login to view your bookings.
            </p>
        `;

        return;
    }


    const bookings =
        JSON.parse(localStorage.getItem("bookings")) || [];


    const userBookings =
        bookings.filter(
            booking =>
                booking.userEmail === user.email
        );


    if (userBookings.length === 0) {

        container.innerHTML = `
            <p style="text-align:center">
                You don't have any bookings yet.
            </p>
        `;

        return;
    }


    container.innerHTML = "";


    userBookings.forEach(booking => {

        const card =
            document.createElement("div");

        card.className = "booking-card";


        card.innerHTML = `

            <h3>${booking.eventName}</h3>

            <p>
                Booking ID:
                ${booking.bookingId}
            </p>

            <p>
                Date:
                ${booking.date}
            </p>

            <p>
                Seats:
                ${booking.seats.join(", ")}
            </p>

            <p>
                Amount:
                ₹${booking.total}
            </p>

        `;


        container.appendChild(card);

    });

}


/* ================================
   SHOW SECTION
================================ */

function showSection(sectionId) {

    document
        .querySelectorAll(".section")
        .forEach(section => {

            if (
                section.id === sectionId ||
                section.id === "events" ||
                section.id === "home"
            ) {
                section.classList.remove("hidden");
            }

        });


    document
        .getElementById(sectionId)
        .scrollIntoView({
            behavior: "smooth"
        });

}