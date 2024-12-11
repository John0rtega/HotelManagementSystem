async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  const reservationForm = event.target; // The form that triggered the event
  const submitButton = reservationForm.querySelector('.submit-button');
  submitButton.disabled = true; // Disable the button to prevent multiple submissions

  const formData = new FormData(reservationForm);

  try {
    const response = await fetch(
      'https://obi.kean.edu/~kaisemax@kean.edu/CPS5301/hotel/php/makeReservation.php',
      {
        method: 'POST',
        body: formData, // Use FormData directly for application/x-www-form-urlencoded
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = await response.text(); // Expect plain text from PHP
    alert('Reservation created successfully!'); // Notify the user of success
    console.log('Reservation result:', result);

    // Optionally, reset the form or close the modal
    reservationForm.reset();
    document.getElementById('reservationModal').style.display = 'none'; // Close the modal
  } catch (error) {
    console.error('Error creating reservation:', error);
    alert('There was an error creating the reservation. Please try again.');
  } finally {
    submitButton.disabled = false; // Re-enable the button after processing
  }
}

function initializeForm() {
  const reservationForm = document.getElementById('reservationForm');

  if (reservationForm) {
    // Remove any existing event listeners to prevent duplicate submissions
    reservationForm.removeEventListener('submit', handleFormSubmit);
    reservationForm.addEventListener('submit', handleFormSubmit);
  }
}

// Call the initializeForm function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeForm);
