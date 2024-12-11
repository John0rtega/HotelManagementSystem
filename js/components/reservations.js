// js/components/reservations.js
function renderReservations(filteredData = null) {
  const container = document.getElementById('currentReservationsList');
  if (!container) return;

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
    .then((reservationsData) => {
      // Check if we have valid data structure
      if (!reservationsData || !Array.isArray(reservationsData)) {
        console.error('Invalid data structure:', reservationsData);
        container.innerHTML = '<p>No reservations available</p>';
        return;
      }

      // Use filtered data if provided, otherwise use all reservations
      const dataToRender = filteredData || reservationsData;

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
            <div class="reservation-actions">
              <button onclick="deleteReservation(${
                reservation.reservation_id
              })">Delete</button>
              <button onclick="openUpdateModal(${
                reservation.reservation_id
              })">Update</button>
            </div>
          </div>
        `
        )
        .join('');
    })
    .catch((error) => {
      console.error('Error fetching reservations:', error);
      container.innerHTML = '<p>Error loading reservations</p>';
    });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function fetchRoomData() {
  return fetch(
    'https://obi.kean.edu/~kaisemax@kean.edu/CPS5301/hotel/php/getRoomData.php'
  ) // Replace with your actual endpoint
    .then((response) => response.json())
    .then((data) => {
      return {
        roomTypes: data.roomTypes, // Assuming the response has roomTypes
        roomNumbers: data.roomNumbers, // Assuming the response has roomNumbers
      };
    });
}

function openUpdateModal(reservationId) {
  // Fetch the reservation data for the given ID
  fetch(
    `https://obi.kean.edu/~kaisemax@kean.edu/CPS5301/hotel/php/getReservation.php?reservation_id=${reservationId}`
  )
    .then((response) => response.json())
    .then((reservation) => {
      // Populate the modal fields with the reservation data
      document.getElementById('guestName').value = reservation.guestName;
      document.getElementById('email').value = reservation.email;
      document.getElementById('phone').value = reservation.phone;
      document.getElementById('roomType').value = reservation.roomType;
      document.getElementById('roomNumber').value = reservation.roomNumber;
      document.getElementById('guests').value = reservation.guests;
      document.getElementById('checkIn').value = reservation.checkIn;
      document.getElementById('checkOut').value = reservation.checkOut;

      // Show the modal
      document.getElementById('reservationModal').style.display = 'block';

      // Update the modal's submit button to call updateReservation with the reservation ID
      const submitButton = document.querySelector('.submit-button');
      submitButton.onclick = () => {
        const updatedData = {
          guestName: document.getElementById('guestName').value,
          email: document.getElementById('email').value,
          phone: document.getElementById('phone').value,
          roomType: document.getElementById('roomType').value,
          roomNumber: document.getElementById('roomNumber').value,
          guests: document.getElementById('guests').value,
          checkIn: document.getElementById('checkIn').value,
          checkOut: document.getElementById('checkOut').value,
        };
        updateReservation(reservationId, updatedData);
      };
    })
    .catch((error) => {
      console.error('Error fetching reservation:', error);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  renderReservations(); // Call renderReservations directly
});

function deleteReservation(reservationId) {
  fetch('../php/deleteReservation.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ reservation_id: reservationId }),
  })
    .then((response) => {
      // Log the response to see what is returned
      return response.text(); // Get the response as text
    })
    .then((text) => {
      console.log('Response:', text); // Log the raw response
      return JSON.parse(text); // Try to parse it as JSON
    })
    .then((data) => {
      if (data.success) {
        console.log('Reservation deleted successfully');
        renderReservations(); // Refresh the reservations list
      } else {
        console.error('Error deleting reservation:', data.error);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
