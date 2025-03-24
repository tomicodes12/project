// Check if Text-to-Speech (TTS) is enabled
const isVisuallyImpaired =
  localStorage.getItem("isVisuallyImpaired") === "true";

// Speak function if TTS is enabled
function speak(text) {
  if ("speechSynthesis" in window && isVisuallyImpaired) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.log("Text-to-Speech not enabled or browser doesn't support it.");
  }
}

async function fetchAvailableRooms() {
  try {
    const response = await fetch("https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/Room/available");
    if (!response.ok) throw new Error("Failed to fetch rooms");

    const rooms = await response.json();
    let roomsHtml = "";

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    if (rooms.length > 0) {
      speak("Here are the available rooms.");
    } else {
      speak("Sorry, no rooms are available at the moment.");
    }

    rooms.forEach((room) => {
      roomsHtml += `
        <div class="room">
            <h3>${room.roomType}</h3>
            <p>Available Spaces: <span id="spaces-${room.roomId}">${room.capacity}</span></p>
            <p>Price per night: #${room.price}</p>

            <label for="CheckInDate-${room.roomId}">Check-in Date:</label>
            <input type="date" id="CheckInDate-${room.roomId}" min="${today}">

            <label for="CheckOutDate-${room.roomId}">Check-out Date:</label>
            <input type="date" id="CheckOutDate-${room.roomId}" min="${today}">

            <button onclick="reserveRoom(${room.roomId}, '${room.roomType}', ${room.price})">Make Reservation</button>
        </div>
      `;
    });

    document.getElementById("rooms").innerHTML = roomsHtml;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    speak("There was an error fetching available rooms.");
  }
}

// Save selected room & dates, then go to reservation page
function reserveRoom(roomId, roomType, price) {
  const checkInDate = document.getElementById(`CheckInDate-${roomId}`).value;
  const checkOutDate = document.getElementById(`CheckOutDate-${roomId}`).value;

  if (!checkInDate || !checkOutDate) {
    alert("Please select both check-in and check-out dates.");
    speak("Please select both check-in and check-out dates.");
    return;
  }

  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    alert("Check-out date must be after check-in date.");
    speak("Check-out date must be after check-in date.");
    return;
  }

  // Store data in localStorage
  localStorage.setItem("selectedRoomId", roomId);
  localStorage.setItem("selectedRoomType", roomType);
  localStorage.setItem("selectedRoomPrice", price);
  localStorage.setItem("checkInDate", checkInDate);
  localStorage.setItem("checkOutDate", checkOutDate);

  // Redirect to reservation page
  speak(
    `You have selected the ${roomType} room. Redirecting to the reservation page.`
  );
  window.location.href = "reservation.html";
}

// Load available rooms when the page is ready
document.addEventListener("DOMContentLoaded", fetchAvailableRooms);

// async function fetchAvailableRooms() {
//   try {
//     const response = await fetch("https://localhost:7261/api/Room/available");
//     if (!response.ok) throw new Error("Failed to fetch rooms");

//     const rooms = await response.json();
//     // console.log(rooms);
//     let roomsHtml = "";

//     // Get today's date in YYYY-MM-DD format
//     const today = new Date().toISOString().split("T")[0];

//     rooms.forEach((room) => {
//       roomsHtml += `
//         <div class="room">
//             <h3>${room.roomType}</h3>
//             <p>Available Spaces: <span id="spaces-${room.roomId}">${room.capacity}</span></p>
//             <p>Price per night: $${room.price}</p>

//             <label for="CheckInDate-${room.roomId}">Check-in Date:</label>
//             <input type="date" id="CheckInDate-${room.roomId}" min="${today}">

//             <label for="CheckOutDate-${room.roomId}">Check-out Date:</label>
//             <input type="date" id="CheckOutDate-${room.roomId}" min="${today}">

//             <button onclick="reserveRoom(${room.roomId}, '${room.roomType}', ${room.price})">Make Reservation</button>
//         </div>
//       `;
//     });

//     document.getElementById("rooms").innerHTML = roomsHtml;
//   } catch (error) {
//     console.error("Error fetching rooms:", error);
//   }
// }

// // Save selected room & dates, then go to reservation page
// function reserveRoom(roomId, roomType, price) {
//   const checkInDate = document.getElementById(`CheckInDate-${roomId}`).value;
//   const checkOutDate = document.getElementById(`CheckOutDate-${roomId}`).value;

//   if (!checkInDate || !checkOutDate) {
//     alert("Please select both check-in and check-out dates.");
//     return;
//   }

//   if (new Date(checkInDate) >= new Date(checkOutDate)) {
//     alert("Check-out date must be after check-in date.");
//     return;
//   }

//   // Store data in localStorage
//   localStorage.setItem("selectedRoomId", roomId);
//   localStorage.setItem("selectedRoomType", roomType);
//   localStorage.setItem("selectedRoomPrice", price);
//   localStorage.setItem("checkInDate", checkInDate);
//   localStorage.setItem("checkOutDate", checkOutDate);

//   // Redirect to reservation page
//   window.location.href = "reservation.html";
// }

// // Load available rooms when the page is ready
// document.addEventListener("DOMContentLoaded", fetchAvailableRooms);
