// js/components/reservations.js
function renderReservations(reservations = reservationsData.items) {
  const reservationsList = document.getElementById('reservationsList');
  reservationsList.innerHTML = '';

  reservations.forEach((reservation) => {
    const card = document.createElement('div');
    card.className = 'reservation-card';
    card.innerHTML = `
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
                <button class="delete-btn" onclick="handleDelete(${
                  reservation.id
                })">×</button>
            </div>
            <div class="reservation-details">
                <div class="detail-item">📧 ${reservation.email}</div>
                <div class="detail-item">📱 ${reservation.phone}</div>
                <div class="detail-item">📅 ${reservation.checkIn} to ${
      reservation.checkOut
    }</div>
                <div class="detail-item">🏠 Room: ${reservation.roomType} - ${
      reservation.roomNumber
    }</div>
                <div class="detail-item">👥 Guests: ${reservation.guests}</div>
            </div>
        `;
    reservationsList.appendChild(card);
  });
}

function handleDelete(id) {
  reservationsData.deleteReservation(id);
  renderReservations();
}
