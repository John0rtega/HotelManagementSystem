function initializeSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchFilter = document.getElementById('searchFilter');

  function handleSearch() {
    const query = searchInput.value;
    const filter = searchFilter.value;
    const filteredReservations = reservationsData.getFilteredReservations(
      query,
      filter
    );
    renderReservations(filteredReservations);
  }

  searchInput.addEventListener('input', handleSearch);
  searchFilter.addEventListener('change', handleSearch);
}
