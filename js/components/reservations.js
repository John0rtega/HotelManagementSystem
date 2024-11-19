// js/components/reservations.js
function renderReservations(filteredData = null) {
  const container = document.getElementById('currentReservationsList');
  if (!container) return;

  // Check if we have valid data structure
  if (!reservationsData || !reservationsData.items) {
    console.error('Invalid data structure:', reservationsData);
    container.innerHTML = '<p>No reservations available</p>';
    return;
  }

  // Use filtered data if provided, otherwise use all reservations
  const dataToRender = filteredData || reservationsData.items;

  // Ensure we're working with an array
  if (!Array.isArray(dataToRender)) {
    console.error('Data to render is not an array:', dataToRender);
    container.innerHTML = '<p>No reservations available</p>';
    return;
  }

  // If array is empty, show message
  if (dataToRender.length === 0) {
    container.innerHTML = '<p>No reservations found</p>';
    return;
  }

  // Render the reservations
  container.innerHTML = dataToRender
    .map(
      (reservation) => `
      <div class="reservation-card">
        <div class="reservation-header">
          <div>
            <span class="guest-name">${reservation.guestName}</span>
            <span class="status-badge ${
              reservation.status === 'confirmed'
                ? 'status-confirmed'
                : 'status-pending'
            }">
              ${reservation.status}
            </span>
          </div>
        </div>
        <div class="reservation-details">
          <div class="detail-item">📧 ${reservation.email}</div>
          <div class="detail-item">📱 ${reservation.phone}</div>
          <div class="detail-item">📅 ${formatDate(
            reservation.checkIn
          )} to ${formatDate(reservation.checkOut)}</div>
          <div class="detail-item">🏠 Room: ${reservation.roomType} - ${
        reservation.roomNumber
      }</div>
          <div class="detail-item">👥 Guests: ${reservation.guests}</div>
        </div>
      </div>
    `
    )
    .join('');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Make sure data.js is loaded first
  if (typeof reservationsData === 'undefined') {
    console.error('Reservations data not loaded');
    return;
  }

  renderReservations();
});
