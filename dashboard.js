// Check if Text-to-Speech (TTS) is enabled
const isVisuallyImpaired =
  localStorage.getItem("isVisuallyImpaired") === "true";

// Speak function if TTS is enabled
function speak(text) {
  if ("speechSynthesis" in window && isVisuallyImpaired) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  } else {
    console.log("Text-to-Speech not supported or not enabled.");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Ensure user is logged in
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");

    if (!token || !userId || !userName) {
      alert("User not logged in");
      speak("User not logged in. Redirecting to login page.");
      window.location.href = "login.html";
      return;
    }

    // Get HTML elements
    const userNameElement = document.getElementById("userName");
    const reservationSection = document.getElementById("reservationSection");
    const checkOutButton = document.getElementById("checkOut");
    const makeReservationButton = document.getElementById("makeReservation");
    const modifyReservationButton =
      document.getElementById("modifyReservation");
    const requestServicesButton = document.getElementById("requestServices");
    const speakReservationButton = document.getElementById("speakReservation");

    // Fetch user profile (to get username)
    const userResponse = await fetch(
      `https://localhost:7261/api/UserProfile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        // headers: { Authorization: `Bearer ${userId}` },
      }
    );

    if (userResponse.ok) {
      const userData = await userResponse.json();
      userNameElement.innerText = userData.userName || "";
      speak(`Welcome, ${userData.userName || ""}`);
    } else {
      console.warn("Failed to fetch user profile");
      userNameElement.innerText = "";
    }

    // Fetch user reservations
    const reservationResponse = await fetch(
      "https://localhost:7261/api/reservations/my",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!reservationResponse.ok)
      throw new Error("Failed to fetch reservations");

    const reservations = await reservationResponse.json();

    if (reservations.length > 0) {
      // Get user's reservation details
      const reservation = reservations[0]; // Assuming one active reservation per user
      userNameElement.innerText = reservation.username || "User";

      // Update reservation details in UI
      reservationSection.innerHTML = `
              <h2>Your Reservation</h2>
              <p><strong>Room Type:</strong> ${reservation.roomType}</p>
              <p><strong>Check-in:</strong> ${new Date(
                reservation.checkInDate
              ).toDateString()}</p>
              <p><strong>Check-out:</strong> ${new Date(
                reservation.checkOutDate
              ).toDateString()}</p>
          `;

      speak(
        `You have a reservation for a ${reservation.roomType} from ${new Date(
          reservation.checkInDate
        ).toDateString()} to ${new Date(
          reservation.checkOutDate
        ).toDateString()}.`
      );

      // Show action buttons and speak button
      modifyReservationButton.style.display = "inline-block";
      requestServicesButton.style.display = "inline-block";
      checkOutButton.style.display = "inline-block";
      speakReservationButton.style.display = "inline-block";

      // Speak reservation details on button click
      speakReservationButton.addEventListener("click", function () {
        speak(
          `Your reservation is for a ${reservation.roomType} from ${new Date(
            reservation.checkInDate
          ).toDateString()} to ${new Date(
            reservation.checkOutDate
          ).toDateString()}.`
        );
      });

      // Checkout functionality
      checkOutButton.addEventListener("click", async function () {
        try {
          const checkoutResponse = await fetch(
            `https://localhost:7261/api/reservations/checkout/${reservation.id}`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (!checkoutResponse.ok) throw new Error("Checkout failed");

          alert("Checkout successful!");
          speak("Checkout successful!");
          window.location.reload();
        } catch (error) {
          console.error("Error during checkout:", error);
          alert("Failed to check out. Please try again.");
          speak("Failed to check out. Please try again.");
        }
      });
    } else {
      // No active reservations
      userNameElement.innerText = "Guest";
      reservationSection.innerHTML = "<h2>No Active Reservation</h2>";
      makeReservationButton.style.display = "inline-block";
      speak("You have no active reservations.");
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    speak("An error occurred while loading the dashboard.");
  }
});

// Logout functionality
document.getElementById("logout").addEventListener("click", async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You are already logged out.");
    speak("You are already logged out.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("https://localhost:7261/api/UserLogout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      alert("Logout successful!");
      speak("Logout successful!");
      window.location.href = "login.html";
    } else {
      alert("Logout failed. Try again.");
      speak("Logout failed. Try again.");
    }
  } catch (error) {
    console.error("Logout error:", error);
    alert("An error occurred while logging out.");
    speak("An error occurred while logging out.");
  }
});

// document.addEventListener("DOMContentLoaded", async function () {
//   try {
//     // Ensure user is logged in
//     const token = localStorage.getItem("token");
//     const userId = localStorage.getItem("userId");

//     if (!token || !userId) {
//       alert("User not logged in");
//       window.location.href = "login.html";
//       return;
//     }

//     // Get HTML elements
//     const userNameElement = document.getElementById("userName");
//     const reservationSection = document.getElementById("reservationSection");
//     const checkOutButton = document.getElementById("checkOut");
//     const makeReservationButton = document.getElementById("makeReservation");
//     const modifyReservationButton =
//       document.getElementById("modifyReservation");
//     const requestServicesButton = document.getElementById("requestServices");
//     const speakReservationButton = document.getElementById("speakReservation");

//     // 🔹 Fetch user profile (to get username)
//     const userResponse = await fetch(
//       `https://localhost:7261/api/UserProfile/${userId}`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (userResponse.ok) {
//       const userData = await userResponse.json();
//       userNameElement.innerText = userData.userName || "User"; // Update UI with username
//     } else {
//       console.warn("Failed to fetch user profile");
//       userNameElement.innerText = "User";
//     }

//     // 🔹 Fetch user reservations
//     const reservationResponse = await fetch(
//       "https://localhost:7261/api/reservations/my",
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     if (!reservationResponse.ok)
//       throw new Error("Failed to fetch reservations");

//     const reservations = await reservationResponse.json();

//     if (reservations.length > 0) {
//       // Get user's reservation details
//       const reservation = reservations[0]; // Assuming one active reservation per user
//       userNameElement.innerText = reservation.username || "User";

//       // Update reservation details in UI
//       reservationSection.innerHTML = `
//               <h2>Your Reservation</h2>
//               <p><strong>Room Type:</strong> ${reservation.roomType}</p>
//               <p><strong>Check-in:</strong> ${new Date(
//                 reservation.checkInDate
//               ).toDateString()}</p>
//               <p><strong>Check-out:</strong> ${new Date(
//                 reservation.checkOutDate
//               ).toDateString()}</p>
//           `;

//       // Show action buttons and speak button
//       modifyReservationButton.style.display = "inline-block";
//       requestServicesButton.style.display = "inline-block";
//       checkOutButton.style.display = "inline-block";
//       speakReservationButton.style.display = "inline-block"; // Show the TTS button

//       // ✅ Checkout functionality
//       checkOutButton.addEventListener("click", async function () {
//         try {
//           const checkoutResponse = await fetch(
//             `https://localhost:7261/api/reservations/checkout/${reservation.id}`,
//             {
//               method: "POST",
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );

//           if (!checkoutResponse.ok) throw new Error("Checkout failed");

//           alert("Checkout successful!");
//           window.location.reload(); // Refresh page to update UI
//         } catch (error) {
//           console.error("Error during checkout:", error);
//           alert("Failed to check out. Please try again.");
//         }
//       });
//     } else {
//       // No active reservations
//       userNameElement.innerText = "Guest";
//       reservationSection.innerHTML = "<h2>No Active Reservation</h2>";
//       makeReservationButton.style.display = "inline-block";
//     }
//   } catch (error) {
//     console.error("Error loading dashboard:", error);
//   }
// });

// // ✅ Logout functionality
// document.getElementById("logout").addEventListener("click", async function () {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     alert("You are already logged out.");
//     window.location.href = "login.html";
//     return;
//   }

//   try {
//     const response = await fetch("https://localhost:7261/api/UserLogout", {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (response.ok) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("userId");
//       alert("Logout successful!");
//       window.location.href = "login.html";
//     } else {
//       alert("Logout failed. Try again.");
//     }
//   } catch (error) {
//     console.error("Logout error:", error);
//     alert("An error occurred while logging out.");
//   }
// });
