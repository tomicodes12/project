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

// For TTS feedback on form input fields
const fields = ["FirstName", "LastName", "UserName", "Email", "Password", "PhoneNumber"];
fields.forEach((field) => {
  document.getElementById(field).addEventListener("focus", function () {
    speak(`Please enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
  });
});

// Handle form submission with TTS feedback
document
  .getElementById("applyForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value.trim();
    });

    // Check for empty fields
    if (fields.some((field) => !data[field])) {
      speak("Please fill in all required fields.");
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/UserReg/Register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      let result;
      try {
        result = await response.json();
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        speak("Unexpected server response. Please try again.");
        alert("Unexpected server response. Please try again.");
        return;
      }

      if (response.ok) {
        speak("Registration successful! Check your email to verify.");
        alert("Registration successful! Check your email to verify.");
        // Redirect to confirm-email.html
        window.location.href = "confirm-email.html";
      } else {
        speak(result.message || "Registration failed. Please try again.");
        alert(result.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      speak("Something went wrong. Please check your internet connection.");
      alert("Something went wrong. Please check your internet connection.");
    }
  });





// // Check if Text-to-Speech (TTS) is enabled
// const isVisuallyImpaired =
//   localStorage.getItem("isVisuallyImpaired") === "true";

// // Speak function if TTS is enabled
// function speak(text) {
//   if ("speechSynthesis" in window && isVisuallyImpaired) {
//     const speech = new SpeechSynthesisUtterance(text);
//     window.speechSynthesis.speak(speech);
//   } else {
//     console.log("Text-to-Speech not enabled or browser doesn't support it.");
//   }
// }

// // For TTS feedback on form input fields
// document.getElementById("FirstName").addEventListener("focus", function () {
//   speak("Please enter your first name.");
// });

// document.getElementById("LastName").addEventListener("focus", function () {
//   speak("Please enter your last name.");
// });

// document.getElementById("UserName").addEventListener("focus", function () {
//   speak("Please enter your username.");
// });

// document.getElementById("Email").addEventListener("focus", function () {
//   speak("Please enter your email address.");
// });

// document.getElementById("Password").addEventListener("focus", function () {
//   speak("Please enter your password.");
// });

// document.getElementById("PhoneNumber").addEventListener("focus", function () {
//   speak("Please enter your phone number.");
// });

// // Handle form submission with TTS feedback
// document
//   .getElementById("applyForm")
//   .addEventListener("submit", async function (event) {
//     event.preventDefault();

//     const formData = new FormData(this);
//     const data = {};

//     formData.forEach((value, key) => {
//       data[key] = value.trim();
//     });

//     if (
//       !data.FirstName ||
//       !data.LastName ||
//       !data.UserName ||
//       !data.Email ||
//       !data.Password ||
//       !data.PhoneNumber
//     ) {
//       speak("Please fill in all required fields.");
//       alert("Please fill in all required fields.");
//       return;
//     }

//     try {
//       const response = await fetch(
//         "https://localhost:7261/api/UserReg/Register",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(data),
//         }
//       );

//       let result;
//       try {
//         result = await response.json();
//       } catch (err) {
//         console.error("Failed to parse JSON:", err);
//         speak("Unexpected server response. Please try again.");
//         alert("Unexpected server response. Please try again.");
//         return;
//       }

//       if (response.ok) {
//         speak("Registration successful! Redirecting...");
//         alert("Registration successful! Redirecting...");
//         window.location.href = "login.html";
//       } else {
//         speak(result.message || "Registration failed. Please try again.");
//         alert(result.message || "Registration failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       speak(
//         "Something went wrong. Please check your internet connection and try again."
//       );
//       alert(
//         "Something went wrong. Please check your internet connection and try again."
//       );
//     }
//   });