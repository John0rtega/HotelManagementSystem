class CleaningManager {
  constructor() {
    this.rooms = [
      {
        number: '101',
        floor: 1,
        assignedTo: 'John Doe',
        status: 'pending',
        type: 'Deluxe',
      },
      {
        number: '102',
        floor: 1,
        assignedTo: 'Jane Smith',
        status: 'in-progress',
        type: 'Suite',
      },
      {
        number: '103',
        floor: 1,
        assignedTo: 'John Doe',
        status: 'completed',
        type: 'Deluxe',
      },
      // Add more rooms as needed
    ];

    this.initializeFilters();
    this.loadRooms();
    this.attachEventListeners();
  }

  initializeFilters() {
    // Populate floor filter
    const floorFilter = document.getElementById('floorFilter');
    for (let i = 1; i <= 5; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `Floor ${i}`;
      floorFilter.appendChild(option);
    }

    // Populate staff filter (would come from backend in real app)
    const staffFilter = document.getElementById('assignedToFilter');
    const staffMembers = ['John Doe', 'Jane Smith', 'Bob Johnson'];
    staffMembers.forEach((staff) => {
      const option = document.createElement('option');
      option.value = staff.toLowerCase().replace(' ', '-');
      option.textContent = staff;
      staffFilter.appendChild(option);
    });
  }

  loadRooms() {
    this.renderRooms(this.rooms);
  }

  createRoomCard(room) {
    return `
      <div class="room-card">
        <h3>Room ${room.number}</h3>
        <p>Floor: ${room.floor}</p>
        <p>Assigned to: ${room.assignedTo}</p>
        <div class="status-container">
          <select class="status-select" onchange="window.cleaningManager.updateStatus('${
            room.number
          }', this.value)">
            <option value="pending" ${
              room.status === 'pending' ? 'selected' : ''
            }>Pending</option>
            <option value="in-progress" ${
              room.status === 'in-progress' ? 'selected' : ''
            }>In Progress</option>
            <option value="completed" ${
              room.status === 'completed' ? 'selected' : ''
            }>Completed</option>
          </select>
          <span class="room-status status-${room.status}">${room.status}</span>
        </div>
      </div>
    `;
  }

  getDummyRooms() {
    // This would be replaced with actual data from backend
    return [
      { number: '101', floor: 1, assignedTo: 'John Doe', status: 'pending' },
      {
        number: '102',
        floor: 1,
        assignedTo: 'Jane Smith',
        status: 'in-progress',
      },
      // Add more dummy rooms as needed
    ];
  }

  attachEventListeners() {
    // Add filter functionality
    document.querySelectorAll('.filter-select').forEach((filter) => {
      filter.addEventListener('change', () => this.filterRooms());
    });
  }

  filterRooms() {
    const floorFilter = document.getElementById('floorFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const staffFilter = document.getElementById('assignedToFilter').value;

    let filteredRooms = this.rooms;

    if (floorFilter !== 'all') {
      filteredRooms = filteredRooms.filter(
        (room) => room.floor === parseInt(floorFilter)
      );
    }
    if (statusFilter !== 'all') {
      filteredRooms = filteredRooms.filter(
        (room) => room.status === statusFilter
      );
    }
    if (staffFilter !== 'all') {
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.assignedTo.toLowerCase().replace(' ', '-') === staffFilter
      );
    }

    this.renderRooms(filteredRooms);
  }

  updateStatus(roomNumber, newStatus) {
    const room = this.rooms.find((r) => r.number === roomNumber);
    if (!room) return;

    room.status = newStatus;
    this.loadRooms(); // Refresh display
  }

  renderRooms(rooms) {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.innerHTML = rooms
      .map((room) => this.createRoomCard(room))
      .join('');
  }
}

// Initialize when DOM is loaded and make it globally available
document.addEventListener('DOMContentLoaded', () => {
  window.cleaningManager = new CleaningManager();
});
