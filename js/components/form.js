function initializeForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const reservation = {
      guestName: formData.get('guestName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      roomType: formData.get('roomType'),
      roomNumber: formData.get('roomNumber'),
      guests: formData.get('guests'),
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      status: 'pending',
    };

    if (!Array.isArray(reservationsData.items)) {
      reservationsData.items = [];
    }
    reservation.id = reservationsData.items.length + 1;
    reservationsData.items.push(reservation);

    form.reset();
    const modal = document.getElementById('reservationModal');
    if (modal) {
      modal.style.display = 'none';
    }

    if (window.calendar) {
      window.calendar.calendar.refetchEvents();
    }

    alert('Reservation created successfully!');
  });
}
