document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const reference = urlParams.get("reference"); // Get reference from URL

  if (!reference) {
    document.getElementById("message").innerText = "Invalid payment reference.";
    return;
  }

  try {
    // Fetch transaction verification details
    const response = await fetch(
      `https://moonlitretreats-hbfnfdfabcfpb3d7.canadacentral-01.azurewebsites.net/api/Payment/verify?trxref=${encodeURIComponent(
        reference
      )}&reference=${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Transaction not found or not processed yet.");
    }

    const result = await response.json();

    // Display response data
    document.getElementById("message").innerText = result.message;
    document.getElementById("details").innerHTML = `
      <strong>Reference:</strong> ${result.reference} <br>
      <strong>Reservation ID:</strong> ${result.reservationId} <br>
    `;
  } catch (error) {
    document.getElementById("message").innerText =
      "An error occurred while retrieving payment details.";
  }
});
