document.addEventListener('DOMContentLoaded', function () {
  // Initialize form only if it exists on the page
  const form = document.getElementById('reservationForm');
  if (form) {
    initializeForm();
    initializeTabs();
    initializeSearch();
    renderReservations();
  }

  // Add any other initialization code here
  // Make sure to check if elements exist before accessing them
});
