// js/home.js
// Loads and renders the list of upcoming charity events on the Home page.

document.addEventListener('DOMContentLoaded', () => {
  loadHome();
  document.getElementById('event-list').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-event-id]');
    if (btn) openEventModal(btn.dataset.eventId);
  });
});

async function loadHome() {
  const list = document.getElementById('event-list');
  try {
    const events = await API.getHomeEvents();
    if (events.length === 0) {
      list.innerHTML = '<p>No upcoming events.</p>';
      return;
    }
    list.innerHTML = events.map(renderCard).join('');
  } catch (err) {
    list.innerHTML = `<p class="error">Failed to load events: ${err.message}</p>`;
  }
}

function renderCard(e) {
  const date = new Date(e.event_date).toLocaleDateString();
  const price = e.ticket_price > 0 ? `$${e.ticket_price}` : 'Free';
  return `
    <div class="card">
      <img src="${e.image_url || 'images/placeholder.svg'}" alt="${e.event_name}"
           onerror="this.onerror=null;this.src='images/placeholder.svg';">
      <div class="card-body">
        <span class="badge">${e.category_name}</span>
        <h3>${e.event_name}</h3>
        <p class="meta"><strong>Date:</strong> ${date}</p>
        <p class="meta"><strong>Location:</strong> ${e.location}</p>
        <p class="meta"><strong>Ticket:</strong> ${price}</p>
        <button class="btn" data-event-id="${e.event_id}">View details &rarr;</button>
      </div>
    </div>
  `;
}
