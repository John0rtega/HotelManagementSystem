const reservationsData = {
  items: [
    {
      id: 1,
      guestName: 'John Doe',
      email: 'john@example.com',
      phone: '+1 234-567-8900',
      roomType: 'Deluxe',
      roomNumber: '101',
      checkIn: '2024-11-10',
      checkOut: '2024-11-15',
      guests: 2,
      status: 'confirmed',
    },
    {
      id: 2,
      guestName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 234-567-8901',
      roomType: 'Suite',
      roomNumber: '201',
      checkIn: '2024-11-12',
      checkOut: '2024-11-14',
      guests: 3,
      status: 'pending',
    },
  ],

  addReservation(reservation) {
    this.items.push({
      id: this.items.length + 1,
      ...reservation,
      status: 'confirmed',
    });
  },

  deleteReservation(id) {
    this.items = this.items.filter((reservation) => reservation.id !== id);
  },

  getFilteredReservations(query, filter) {
    if (!query) return this.items;

    query = query.toLowerCase();
    return this.items.filter((reservation) => {
      switch (filter) {
        case 'name':
          return reservation.guestName.toLowerCase().includes(query);
        case 'email':
          return reservation.email.toLowerCase().includes(query);
        case 'room':
          return reservation.roomNumber.toLowerCase().includes(query);
        case 'all':
        default:
          return (
            reservation.guestName.toLowerCase().includes(query) ||
            reservation.email.toLowerCase().includes(query) ||
            reservation.roomNumber.toLowerCase().includes(query) ||
            reservation.phone.toLowerCase().includes(query)
          );
      }
    });
  },
};
