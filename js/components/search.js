function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchFilter = document.getElementById('searchFilter');

  if (!searchInput || !searchFilter) return;

  let reservationsData = []; // Declare a variable to hold reservations data

  // Fetch reservation data from an external PHP file
  fetch(
    'https://obi.kean.edu/~kaisemax@kean.edu/CPS5301/hotel/php/printReservationData.php'
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      reservationsData = data; // Store fetched data
      handleSearch(); // Call handleSearch to render initial data
    })
    .catch((error) => {
      console.error('Error fetching reservations:', error);
    });

  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filter = searchFilter.value;

    // Make sure reservationsData exists and has items
    if (!reservationsData || !Array.isArray(reservationsData)) {
      console.error('Invalid reservations data');
      return;
    }

    const filteredData = reservationsData.filter((reservation) => {
      if (filter === 'all') {
        // Search all fields
        return Object.values(reservation).some((value) =>
          String(value).toLowerCase().includes(query)
        );
      }

      // Search specific fields
      switch (filter) {
        case 'name':
          return reservation.guestName.toLowerCase().includes(query);
        case 'email':
          return reservation.email.toLowerCase().includes(query);
        case 'room':
          return reservation.roomNumber.toLowerCase().includes(query);
        default:
          return false;
      }
    });

    renderReservations(filteredData); // Use the render function from reservations.js
  }

  searchInput.addEventListener('input', handleSearch);
  searchFilter.addEventListener('change', handleSearch);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
});
