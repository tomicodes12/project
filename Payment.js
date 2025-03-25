// Check if Text-to-Speech (TTS) is enabled
const isVisuallyImpaired = localStorage.getItem("isVisuallyImpaired") === "true";

// Speak function if TTS is enabled
function speak(text) {
  if ("speechSynthesis" in window && isVisuallyImpaired) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const reservationData = JSON.parse(localStorage.getItem("reservation"));
  const userName = localStorage.getItem("userName");
  const userEmail = localStorage.getItem("userEmail");

  if (
    !reservationData ||
    !reservationData.roomId ||
    !reservationData.totalPrice
  ) {
    speak("Reservation details are missing. Redirecting to rooms page.");
    alert("Reservation details are missing. Please make a reservation first.");
    window.location.href = "rooms.html";
    return;
  }

  const nameField = document.getElementById("Name");
  const emailField = document.getElementById("Email");
  const amountField = document.getElementById("Amount");

  if (!nameField || !emailField || !amountField) {
    console.error("One or more input fields not found!");
    return;
  }

  nameField.value = userName || "";
  emailField.value = userEmail || "";
  amountField.value = reservationData.totalPrice;
  amountField.readOnly = true;

  // Provide spoken feedback when focusing on fields
  nameField.addEventListener("focus", () => speak("Please enter your full name."));
  emailField.addEventListener("focus", () => speak("Please enter your email address."));
  amountField.addEventListener("focus", () => speak("This is the total payment amount. You cannot change this."));

  document
    .getElementById("paymentForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const Name = nameField.value.trim();
      const Email = emailField.value.trim();
      const Amount = parseFloat(amountField.value || "0");

      if (!Name || !Email || Amount <= 0) {
        speak("Please fill in all fields correctly.");
        alert("Please fill in all fields correctly.");
        return;
      }

      await InitializePayment(Name, Email, Amount);
    });
});

async function InitializePayment(Name, Email, Amount) {
  const reservationData = JSON.parse(localStorage.getItem("reservation"));
  const userId = localStorage.getItem("userId");

  if (!reservationData || !reservationData.roomId || !reservationData.totalPrice) {
    speak("Reservation details are missing. Please try again.");
    alert("Reservation details are missing. Please try again.");
    return;
  }

  if (!userId) {
    speak("User ID is missing. Please log in again.");
    alert("User ID is missing. Please log in again.");
    return;
  }

  const TrxRef = `HMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const payload = {
    userId: parseInt(userId, 10),
    roomId: parseInt(reservationData.roomId, 10),
    amount: parseFloat(reservationData.totalPrice),
    email: Email,
    name: Name,
    roomType: reservationData.roomType,
    trxRef: TrxRef,
  };

  try {
    const response = await fetch("https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/Payment/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok && result.paymentUrl) {
      // Store transaction reference for verification
      localStorage.setItem("trxRef", TrxRef);
      speak("Redirecting to payment page.");
      window.location.href = result.paymentUrl;
    } else {
      speak("Payment initialization failed. Please try again.");
      alert(result.message || "Failed to initialize payment.");
    }
  } catch (error) {
    speak("An error occurred. Please try again.");
    console.error("Error initializing payment:", error);
    alert("An error occurred. Please try again.");
  }
}

// Redirect to dashboard after verifying payment on success page
document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.href.includes("success.html")) {
    speak("Verifying payment. Please wait.");

    const trxRef = localStorage.getItem("trxRef");
    if (!trxRef) {
      speak("Transaction reference missing. Redirecting to dashboard.");
      window.location.href = "dashboard.html";
      return;
    }

    try {
      // Call Verify Endpoint
      const response = await fetch(`https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/Payment/verify?reference=${trxRef}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trxRef }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        speak("Payment verified. Redirecting to dashboard.");
        localStorage.removeItem("trxRef"); // Clean up after verification
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 5000);
      } else {
        speak("Payment verification failed. Contact support.");
        alert("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      speak("An error occurred while verifying payment.");
      console.error("Payment verification error:", error);
      alert("Error verifying payment. Please try again.");
    }
  }
});





// // Check if Text-to-Speech (TTS) is enabled
// const isVisuallyImpaired = localStorage.getItem("isVisuallyImpaired") === "true";

// // Speak function if TTS is enabled
// function speak(text) {
//   if ("speechSynthesis" in window && isVisuallyImpaired) {
//     const speech = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(speech);
//   }
// }

// document.addEventListener("DOMContentLoaded", function () {
//   const reservationData = JSON.parse(localStorage.getItem("reservation"));
//   const userName = localStorage.getItem("userName");
//   const userEmail = localStorage.getItem("userEmail");

//   if (
//     !reservationData ||
//     !reservationData.roomId ||
//     !reservationData.totalPrice
//   ) {
//     speak("Reservation details are missing. Redirecting to rooms page.");
//     alert("Reservation details are missing. Please make a reservation first.");
//     window.location.href = "rooms.html";
//     return;
//   }

//   const nameField = document.getElementById("Name");
//   const emailField = document.getElementById("Email");
//   const amountField = document.getElementById("Amount");

//   if (!nameField || !emailField || !amountField) {
//     console.error("One or more input fields not found!");
//     return;
//   }

//   nameField.value = userName || "";
//   emailField.value = userEmail || "";
//   amountField.value = reservationData.totalPrice;
//   amountField.readOnly = true;

//   // Provide spoken feedback when focusing on fields
//   nameField.addEventListener("focus", () => speak("Please enter your full name."));
//   emailField.addEventListener("focus", () => speak("Please enter your email address."));
//   amountField.addEventListener("focus", () => speak("This is the total payment amount. You cannot change this."));

//   document
//     .getElementById("paymentForm")
//     .addEventListener("submit", async function (event) {
//       event.preventDefault();

//       const Name = nameField.value.trim();
//       const Email = emailField.value.trim();
//       const Amount = parseFloat(amountField.value || "0");

//       if (!Name || !Email || Amount <= 0) {
//         speak("Please fill in all fields correctly.");
//         alert("Please fill in all fields correctly.");
//         return;
//       }

//       await InitializePayment(Name, Email, Amount);
//     });
// });

// async function InitializePayment(Name, Email, Amount) {
//   const reservationData = JSON.parse(localStorage.getItem("reservation"));
//   const userId = localStorage.getItem("userId");

//   if (!reservationData || !reservationData.roomId || !reservationData.totalPrice) {
//     speak("Reservation details are missing. Please try again.");
//     alert("Reservation details are missing. Please try again.");
//     return;
//   }

//   if (!userId) {
//     speak("User ID is missing. Please log in again.");
//     alert("User ID is missing. Please log in again.");
//     return;
//   }

//   const TrxRef = `HMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

//   const payload = {
//     userId: parseInt(userId, 10),
//     roomId: parseInt(reservationData.roomId, 10),
//     amount: parseFloat(reservationData.totalPrice),
//     email: Email,
//     name: Name,
//     roomType: reservationData.roomType,
//     trxRef: TrxRef,
//   };

//   try {
//     const response = await fetch("https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/Payment/initialize", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await response.json();

//     if (response.ok && result.paymentUrl) {
//       // Store transaction reference for verification
//       localStorage.setItem("trxRef", TrxRef);
//       speak("Redirecting to payment page.");
//       window.location.href = result.paymentUrl;
//     } else {
//       speak("Payment initialization failed. Please try again.");
//       alert(result.message || "Failed to initialize payment.");
//     }
//   } catch (error) {
//     speak("An error occurred. Please try again.");
//     console.error("Error initializing payment:", error);
//     alert("An error occurred. Please try again.");
//   }
// }

// // Redirect to dashboard after success page
// document.addEventListener("DOMContentLoaded", () => {
//   if (window.location.href.includes("success.html")) {
//     speak("Payment successful. Redirecting to dashboard.");
//     setTimeout(() => {
//       window.location.href = "dashboard.html";
//     }, 5000);
//   }
// });