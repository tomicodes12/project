function setAccessibilityPreference(isVisuallyImpaired) {
  localStorage.setItem("isVisuallyImpaired", isVisuallyImpaired);
  window.location.href = "index1.html"; // Redirect to the main page
}
