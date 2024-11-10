function initializeForm() {
  const form = document.getElementById('reservationForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newReservation = {
      guestName: formData.get('guestName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      roomType: formData.get('roomType'),
      roomNumber: formData.get('roomNumber'),
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      guests: parseInt(formData.get('guests')),
    };

    reservationsData.addReservation(newReservation);
    renderReservations();
    form.reset();

    // Switch to reservations tab
    document.querySelector('[data-tab="reservations"]').click();
  });
}
