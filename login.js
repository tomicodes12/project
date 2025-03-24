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

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const responseMessage = document.getElementById("responseMessage");

  if (!loginForm) {
    console.error("Error: loginForm element not found");
    return;
  }

  if (!responseMessage) {
    console.error("Error: responseMessage element not found");
    return;
  }

  // Focus event for email field
  document.getElementById("Email").addEventListener("focus", function () {
    speak("Please enter your email address.");
  });

  // Focus event for password field
  document.getElementById("Password").addEventListener("focus", function () {
    speak("Please enter your password.");
  });

  // Submit event for form submission
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("Password").value.trim();

    if (!email || !password) {
      responseMessage.textContent = "Please enter both email and password.";
      speak("Please enter both email and password.");
      return;
    }

    const loginData = { email, password };

    try {
      const response = await fetch(
        "https://localhost:7261/api/UserLogin/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const responseText = await response.text();
      console.log("Raw Response Text:", responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Error parsing response as JSON:", e);
        alert("Unexpected response from the server. Please try again.");
        return;
      }

      console.log("Parsed Response Data:", responseData);

      if (response.ok) {
        speak("Login successful! Redirecting...");
        alert("Login successful!");

        // Store user data in localStorage
        if (responseData.userId) {
          localStorage.setItem("userId", responseData.userId);
        }

        if (responseData.userName) {
          localStorage.setItem("userName", responseData.userName);
        }

        if (responseData.email) {
          localStorage.setItem("userEmail", responseData.email);
        }

        if (responseData.token) {
          localStorage.setItem("token", responseData.token);
        }

        localStorage.setItem("userLoggedIn", true); // Set login status

        // Fetch reservations before redirecting
        const token = responseData.token;
        const userId = responseData.userId;

        if (token && userId) {
          const reservationsResponse = await fetch(
            "https://localhost:7261/api/reservations/my",
            {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (reservationsResponse.ok) {
            const reservations = await reservationsResponse.json();
            if (reservations.length > 0) {
              speak("Redirecting to Dashboard...");
              window.location.href = "/dashboard.html";
              return;
            }
          } else {
            console.warn(
              "Failed to fetch reservations. Proceeding with default redirect."
            );
          }
        }

        speak("Redirecting to Rooms page...");
        window.location.href = "/Rooms.html"; // Default redirect if no reservations
      } else {
        responseMessage.textContent =
          responseData.message || "Login failed, please try again.";
        speak(responseData.message || "Login failed, please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong. Please try again.");
      speak("Something went wrong. Please try again.");
    }
  });
});
