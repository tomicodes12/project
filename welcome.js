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

// Wait for the DOM to be fully loaded before running any script
document.addEventListener("DOMContentLoaded", function () {
  const registerButton = document.getElementById("registerButton");
  const loginButton = document.getElementById("loginButton");

  // Provide voice feedback when page loads
  speak("Welcome to Moonlit Retreats. Please select Register or Login.");

  // Event listener for Register button
  registerButton.addEventListener("click", function () {
    speak("Navigating to the registration page.");
    window.location.href = "registration.html"; // Redirect to registration page
  });

  // Event listener for Login button
  loginButton.addEventListener("click", function () {
    speak("Navigating to the login page.");
    window.location.href = "login.html"; // Redirect to login page
  });
});
