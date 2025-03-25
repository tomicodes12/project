const isVisuallyImpaired =
  localStorage.getItem("isVisuallyImpaired") === "true";

// Text-to-Speech function
function speak(text) {
  if (isVisuallyImpaired && "speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.log("Text-to-Speech is disabled or not supported.");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  const roomId = localStorage.getItem("selectedRoomId");
  const checkInDate = localStorage.getItem("checkInDate");
  const checkOutDate = localStorage.getItem("checkOutDate");

  if (!roomId || !checkInDate || !checkOutDate) {
    alert("Invalid reservation data. Redirecting...");
    window.location.href = "rooms.html";
    return;
  }

  try {
    const response = await fetch(`https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/Room/${roomId}`);
    if (!response.ok) throw new Error("Failed to fetch room details");

    const room = await response.json();

    // Calculate total price
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = Math.ceil((endDate - startDate) / (1000 * 3600 * 24));
    const totalPrice = room.price * nights;

    // Update the UI
    document.getElementById("roomType").textContent = room.roomType;
    document.getElementById("roomPrice").textContent = room.price;
    document.getElementById("roomCapacity").textContent = room.capacity;
    document.getElementById("totalPrice").textContent = totalPrice;
    document.getElementById("checkInDate").textContent = checkInDate;
    document.getElementById("checkOutDate").textContent = checkOutDate;

    // Save reservation details for payment page
    const reservationDetails = {
      roomId,
      roomType: room.roomType,
      pricePerNight: room.price,
      totalPrice,
      checkInDate,
      checkOutDate,
    };

    console.log("Attempting to save reservation data:", reservationDetails);
    localStorage.setItem("reservation", JSON.stringify(reservationDetails));

    // Text-to-Speech feedback (only if enabled)
    speak(
      `Room type: ${room.roomType}. Price per night: $${room.price}. Available Spaces: ${room.capacity}. Total price: #${totalPrice}. Check-in-Date: ${checkInDate}. Check-out-Date: ${checkOutDate}`
    );
  } catch (error) {
    console.error("Error loading room details:", error);
    alert("Error loading room details. Please try again.");
    speak("Error loading room details. Please try again.");
  }
});

// Function to confirm reservation and redirect to payment
function confirmReservation() {
  const reservationData = localStorage.getItem("reservation");

  if (!reservationData) {
    alert("Reservation details are missing. Please try again.");
    speak("Reservation details are missing. Please try again.");
    return;
  }

  console.log("Stored reservation data before redirect:", reservationData);
  alert("Reservation confirmed! Redirecting to payment...");
  speak("Reservation confirmed! Redirecting to payment page.");

  window.location.href = "Payment.html";
}
