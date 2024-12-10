function initializeForm() {
  const reservationForm = document.getElementById('reservationForm');

  if (reservationForm) {
    reservationForm.addEventListener('submit', async (event) => {
      event.preventDefault(); // Prevent the default form submission

      // Gather form data
      const formData = new FormData(reservationForm);
      const data = {
        checkIn: formData.get('checkIn'),
        checkOut: formData.get('checkOut'),
        roomType: formData.get('roomType'),
        roomNumber: formData.get('roomNumber'),
        guestName: formData.get('guestName'),
        email: formData.get('email'),
        guests: formData.get('guests'),
      };

      try {
        const response = await fetch(
          'https://obi.kean.edu/~kaisemax@kean.edu/CPS5301/hotel/php/makeReservation.php',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert('Reservation created successfully!'); // Notify the user of success
        console.log('Reservation result:', result);

        // Optionally, reset the form or close the modal
        reservationForm.reset();
        // Close the modal if needed
        const modal = document.getElementById('reservationModal');
        if (modal) {
          modal.style.display = 'none';
        }
      } catch (error) {
        console.error('Error creating reservation:', error);
        alert('There was an error creating the reservation. Please try again.');
      }
    });
  }
}

// Call the initializeForm function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeForm);
