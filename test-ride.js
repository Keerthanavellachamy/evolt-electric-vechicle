// ===== EVOLT MOTORS — Test Ride Booking (LocalStorage demo) =====

const TestRide = (() => {
  function generateBookingId() {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `TR${rand}`;
  }

  function book(details) {
    const booking = { id: generateBookingId(), ...details, createdAt: new Date().toISOString() };
    const all = JSON.parse(localStorage.getItem('evolt_testrides') || '[]');
    all.push(booking);
    localStorage.setItem('evolt_testrides', JSON.stringify(all));
    return booking;
  }

  return { book };
})();
