document.addEventListener('DOMContentLoaded', function () {
  // Initialize form only if it exists on the page
  const form = document.getElementById('reservationForm');
  if (form) {
    initializeForm();
    initializeTabs();
    initializeSearch();
    renderReservations();
  }

  // Dark mode toggle functionality
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.onclick = function () {
      document.body.classList.toggle('dark-mode');
    };
  }

  // Add dark mode styles in CSS
  const style = document.createElement('style');
  style.innerHTML = `
    .dark-mode {
      background-color: #121212;
      color: #ffffff;
    }
    .dark-mode .modal-content {
      background-color: #1e1e1e;
      color: #ffffff;
    }
    .dark-mode .close {
      color: #ffffff;
    }
  `;
  document.head.appendChild(style);
});
