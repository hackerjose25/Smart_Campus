/**
 * Smart Campus Portal — Professional Calendar Component
 * Reusable logic for rendering a monthly calendar that highlights lab bookings.
 */

class CampusCalendar {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentDate = new Date();
    this.bookings = [];
    this.init();
  }

  async init() {
    await this.fetchBookings();
    this.render();
  }

  async fetchBookings() {
    try {
      const res = await fetch('http://localhost:5000/api/lab-bookings');
      if (res.ok) {
        this.bookings = await res.json();
      }
    } catch (err) {
      console.error('Calendar: Failed to fetch bookings', err);
    }
  }

  prevMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
  }

  render() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const monthName = this.currentDate.toLocaleString('default', { month: 'long' });

    // Header HTML
    let html = `
      <div class="calendar-card animate-in">
        <div class="calendar-header">
          <div class="calendar-title">
            <span style="font-size:1.4rem">📅</span>
            <div>
              <div style="font-size:1.1rem; font-weight:700">${monthName} ${year}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:500">Lab Booking Schedule</div>
            </div>
          </div>
          <div class="calendar-controls">
            <button class="calendar-btn" onclick="portalCalendar.prevMonth()">&lt;</button>
            <button class="calendar-btn" onclick="portalCalendar.nextMonth()">&gt;</button>
          </div>
        </div>
        <div class="calendar-grid">
          <div class="calendar-day-label">Sun</div>
          <div class="calendar-day-label">Mon</div>
          <div class="calendar-day-label">Tue</div>
          <div class="calendar-day-label">Wed</div>
          <div class="calendar-day-label">Thu</div>
          <div class="calendar-day-label">Fri</div>
          <div class="calendar-day-label">Sat</div>
    `;

    // Calculate days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDaysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();

    // Previous month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="calendar-day other-month"><span class="day-number">${prevDaysInMonth - i}</span></div>`;
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const dayBookings = this.bookings.filter(b => {
        if (!b.date) return false;
        // Only show approved/permitted bookings
        if ((b.status || '').toLowerCase() !== 'approved') return false;
        const bDate = new Date(b.date);
        return bDate.getFullYear() === year && bDate.getMonth() === month && bDate.getDate() === d;
      });

      html += `
        <div class="calendar-day ${isToday ? 'today' : ''}">
          <span class="day-number">${d}</span>
          ${dayBookings.length > 0 ? `
            <div class="booking-dots">
              ${dayBookings.map(() => '<div class="booking-dot"></div>').join('')}
            </div>
            <div class="calendar-tooltip">
              <div style="font-weight:700; font-size:0.8rem; margin-bottom:6px; border-bottom:1px solid var(--border); padding-bottom:4px">
                Bookings for ${d} ${monthName}
              </div>
              ${dayBookings.map(b => `
                <div class="tooltip-item">
                  <div class="tooltip-lab">${b.lab || 'Lab'}</div>
                  <div class="tooltip-time">⏰ ${b.timeSlot || '—'}</div>
                  <div class="tooltip-student">${b.studentEmail || '—'}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;
    }

    // Next month padding (to fill 6 rows if needed, or just enough to look square)
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    for (let i = 1; i <= (totalCells - (firstDay + daysInMonth)); i++) {
      html += `<div class="calendar-day other-month"><span class="day-number">${i}</span></div>`;
    }

    html += `</div></div>`;
    this.container.innerHTML = html;
  }
}

// Global instance to be called from the dashboard
window.portalCalendar = null;
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('calendar-root')) {
        window.portalCalendar = new CampusCalendar('calendar-root');
    }
});
