function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchFilter = document.getElementById('searchFilter');

  if (!searchInput || !searchFilter) return;

  function handleSearch() {
    const query = searchInput.value.toLowerCase();
    const filter = searchFilter.value;

    // Make sure reservationsData exists and has items
    if (!reservationsData || !reservationsData.items) {
      console.error('Invalid reservations data');
      return;
    }

    const filteredData = reservationsData.items.filter((reservation) => {
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

    renderReservations(filteredData);
  }

  searchInput.addEventListener('input', handleSearch);
  searchFilter.addEventListener('change', handleSearch);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSearch();
});
