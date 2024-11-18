class RoomCalendar {
  constructor() {
    this.rooms = {
      Deluxe: ['101', '201'],
      Suite: ['102', '202'],
      Executive: ['103'],
    };
    this.calendar = null;
    this.modal = null;
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

  initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) return;

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
      events: this.getBookedDates(),
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
    const selectedDate = selectInfo.start;
    const availableRooms = this.getAvailableRooms(selectedDate);

    if (Object.values(availableRooms).flat().length === 0) {
      alert('No rooms available for this date');
      return;
    }

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
    if (!Array.isArray(reservationsData.items)) return false;

    return reservationsData.items.some((reservation) => {
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

  getBookedDates() {
    if (!Array.isArray(reservationsData.items)) {
      console.error('Invalid reservations data structure');
      return [];
    }

    return reservationsData.items.map((reservation) => ({
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
  }

  getRoomTypeColor(roomType) {
    const colors = {
      Deluxe: '#4CAF50',
      Suite: '#2196F3',
      Executive: '#9C27B0',
    };
    return colors[roomType] || '#666';
  }
}

// Initialize the calendar and handle tab switching
document.addEventListener('DOMContentLoaded', () => {
  const calendar = new RoomCalendar();

  // Handle tab switching
  const tabs = document.querySelectorAll('.tab-button');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setTimeout(() => {
        if (calendar.calendar) {
          calendar.calendar.updateSize();
          window.dispatchEvent(new Event('resize'));
        }
      }, 100);
    });
  });

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (calendar.calendar) {
        calendar.calendar.updateSize();
      }
    }, 250);
  });
});
