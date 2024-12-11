// calendar.js

class HotelCalendar {
  constructor() {
    this.rooms = {
      Deluxe: ['101', '201'],
      Suite: ['102', '202'],
      Executive: ['103'],
    };
    this.calendar = null;
    this.modal = null;
    this.reservationsData = []; // Store fetched reservations data
    this.init();
  }

  init() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    this.initializeCalendar();
    this.setupModal();

    // Force resize after a short delay
    setTimeout(() => {
      if (this.calendar) {
        this.calendar.updateSize();
        window.dispatchEvent(new Event('resize'));
      }
    }, 100);
  }

  // Initialize the calendar
  async initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

    const events = await this.getBookedDates(); // Wait for events data

    this.calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth',
      },
      height: 'auto',
      aspectRatio: 1.35,
      expandRows: true,
      handleWindowResize: true,
      selectable: true,
      select: (info) => this.handleDateSelect(info),
      events, // Use the fetched events
      eventContent: (arg) => {
        return {
          html: `<div class="fc-event-title">${arg.event.title}</div>`,
        };
      },
      eventDidMount: (info) => {
        tippy(info.el, {
          content: info.event.extendedProps.description,
          allowHTML: true,
          placement: 'top',
        });
      },
      viewDidMount: () => {
        setTimeout(() => {
          this.calendar.updateSize();
        }, 0);
      },
    });

    this.calendar.render();
  }

  handleDateSelect(selectInfo) {
    console.log('Date selected:', selectInfo.start); // Debugging line
    const selectedDate = selectInfo.start;
    const availableRooms = this.getAvailableRooms(selectedDate);

    if (Object.values(availableRooms).flat().length === 0) {
      alert('No rooms available for this date');
      return;
    }

    // Open reservation modal
    this.openReservationModal(selectedDate, availableRooms);
  }

  getAvailableRooms(date) {
    const availableRooms = {};

    Object.entries(this.rooms).forEach(([roomType, rooms]) => {
      availableRooms[roomType] = rooms.filter(
        (roomNumber) => !this.isRoomBooked(roomNumber, date)
      );
    });

    return availableRooms;
  }

  isRoomBooked(roomNumber, date) {
    if (!Array.isArray(this.reservationsData)) return false; // Use stored reservations data

    return this.reservationsData.some((reservation) => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const targetDate = new Date(date);
      return (
        reservation.roomNumber === roomNumber &&
        targetDate >= checkIn &&
        targetDate <= checkOut
      );
    });
  }

  openReservationModal(date, availableRooms) {
    if (!this.modal) return;

    // Reset form
    const form = document.getElementById('reservationForm');
    if (form) form.reset();

    // Set check-in date
    const checkInInput = document.querySelector('[name="checkIn"]');
    const checkOutInput = document.querySelector('[name="checkOut"]');

    if (checkInInput && checkOutInput) {
      const checkInDate = date.toISOString().split('T')[0];
      checkInInput.value = checkInDate;

      // Set minimum date for check-out to be the day after check-in
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      checkOutInput.min = nextDay.toISOString().split('T')[0];

      // Set default check-out date to next day
      checkOutInput.value = nextDay.toISOString().split('T')[0];
    }

    // Update room type options based on availability
    const roomTypeSelect = document.querySelector('[name="roomType"]');
    if (roomTypeSelect) {
      roomTypeSelect.innerHTML = '';
      Object.keys(availableRooms).forEach((roomType) => {
        if (availableRooms[roomType].length > 0) {
          const option = document.createElement('option');
          option.value = roomType;
          option.textContent = roomType;
          roomTypeSelect.appendChild(option);
        }
      });

      // Trigger room number update
      roomTypeSelect.onchange = () => {
        this.updateAvailableRooms(roomTypeSelect.value, availableRooms);
      };

      // Initial room numbers population
      if (roomTypeSelect.value) {
        this.updateAvailableRooms(roomTypeSelect.value, availableRooms);
      }
    }

    // Show modal
    this.modal.style.display = 'block';
  }

  updateAvailableRooms(selectedRoomType, availableRooms) {
    const roomNumberSelect = document.querySelector('[name="roomNumber"]');
    if (!roomNumberSelect) return;

    roomNumberSelect.innerHTML = '';

    if (selectedRoomType && availableRooms[selectedRoomType]) {
      availableRooms[selectedRoomType].forEach((roomNumber) => {
        const option = document.createElement('option');
        option.value = roomNumber;
        option.textContent = `Room ${roomNumber}`;
        roomNumberSelect.appendChild(option);
      });
    }
  }

  setupModal() {
    this.modal = document.getElementById('reservationModal');
    if (!this.modal) return;

    const closeBtn = this.modal.querySelector('.close-modal');
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.modal.style.display = 'none';
      };
    }

    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.modal.style.display = 'none';
      }
    };
  }

  // Fetch booked dates from the server
  async getBookedDates() {
    try {
      const response = await fetch(
        'https://obi.kean.edu/~kaisemax@kean.edu/CPS5301/hotel/php/printReservationData.php'
      );
      if (!response.ok) throw new Error('Network response was not ok');
      const reservations = await response.json();
      this.reservationsData = reservations; // Store reservations

      // Map reservations to calendar events
      return Array.from(
        new Map(reservations.map((res) => [res.reservation_id, res])).values()
      ).map((reservation) => ({
        title: `${reservation.roomNumber} - ${reservation.guestName}`,
        start: reservation.checkIn,
        end: reservation.checkOut,
        backgroundColor: this.getRoomTypeColor(reservation.roomType),
        extendedProps: {
          description: `
            <div class="event-tooltip">
              <p><strong>Room:</strong> ${reservation.roomNumber} (${reservation.roomType})</p>
              <p><strong>Guest:</strong> ${reservation.guestName}</p>
              <p><strong>Email:</strong> ${reservation.email}</p>
              <p><strong>Guests:</strong> ${reservation.guests}</p>
            </div>
          `,
        },
      }));
    } catch (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
  }

  // Get color based on room type
  getRoomTypeColor(roomType) {
    const colors = {
      Deluxe: '#f39c12',
      Standard: '#3498db',
      Suite: '#e74c3c',
      Economy: '#2ecc71',
    };
    return colors[roomType] || '#95a5a6';
  }

  async refreshCalendar() {
    if (this.calendar) {
      const events = await this.getBookedDates();
      this.calendar.removeAllEvents();
      this.calendar.addEventSource(events);
    }
  }
}

// Initialize the calendar when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
  const hotelCalendar = new HotelCalendar();
  hotelCalendar.initializeCalendar();
});
