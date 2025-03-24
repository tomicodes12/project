const apiBaseUrl = "https://localhost:7261/api/ForgotPassword";

// Request Password Reset
async function requestPasswordReset() {
  const email = document.getElementById("emailInput").value;
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/RequestReset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    document.getElementById("requestResetMessage").textContent = result.message;
  } catch (error) {
    document.getElementById("requestResetMessage").textContent =
      "Error sending reset request.";
  }
}

// Reset Password
async function resetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const newPassword = document.getElementById("newPasswordInput").value;

  if (!token || !newPassword) {
    alert("Token and new password are required.");
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/Reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const result = await response.json();
    document.getElementById("resetPasswordMessage").textContent =
      result.message;
  } catch (error) {
    document.getElementById("resetPasswordMessage").textContent =
      "Error resetting password.";
  }
}
