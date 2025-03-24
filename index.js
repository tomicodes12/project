function setAccessibilityPreference(isVisuallyImpaired) {
  localStorage.setItem("isVisuallyImpaired", isVisuallyImpaired);
  window.location.href = "index.html"; // Redirect to the main page
}
