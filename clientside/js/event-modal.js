// js/event-modal.js
// Shared event-detail modal. Used by the Events list and Search results so that
// "View details" opens the event's content in-place instead of navigating away.

function createEventModal() {
  if (document.getElementById('event-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'event-modal';
  modal.className = 'modal hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="modal-content modal-content--wide">
      <button class="modal-close" id="event-modal-close" aria-label="Close">&times;</button>
      <div id="event-modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.id === 'event-modal-close') closeEventModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEventModal();
  });
}

async function openEventModal(id) {
  createEventModal();
  const body = document.getElementById('event-modal-body');
  document.getElementById('event-modal').classList.remove('hidden');
  body.innerHTML = '<p class="loading">Loading...</p>';
  try {
    const e = await API.getEvent(id);
    body.innerHTML = renderEventDetail(e);
  } catch (err) {
    body.innerHTML = `<p class="error">Failed to load event: ${err.message}</p>`;
  }
}

function closeEventModal() {
  const modal = document.getElementById('event-modal');
  if (modal) modal.classList.add('hidden');
}

function renderEventDetail(e) {
  const date = new Date(e.event_date).toLocaleString();
  const progress = e.goal_amount > 0
    ? Math.min(100, (e.raised_amount / e.goal_amount) * 100).toFixed(1)
    : 0;
  const price = e.ticket_price > 0 ? `$${e.ticket_price}` : 'Free';

  return `
    <div class="detail-hero">
      <img src="${e.image_url || 'images/placeholder.svg'}" alt="${e.event_name}"
           onerror="this.onerror=null;this.src='images/placeholder.svg';">
    </div>
    <h2>${e.event_name}</h2>
    <div class="detail-sub">
      <span class="badge">${e.category_name}</span>
      <span class="status ${e.status}">${e.status}</span>
    </div>
    <div class="detail-grid">
      <p><strong>Organisation:</strong> ${e.org_name}</p>
      <p><strong>Category:</strong> ${e.category_name}</p>
      <p><strong>Time:</strong> ${date}</p>
      <p><strong>Location:</strong> ${e.location}</p>
      <p><strong>Ticket:</strong> ${price}</p>
      <p><strong>Contact:</strong> ${e.contact_email || '—'}${e.contact_phone ? ' | ' + e.contact_phone : ''}</p>
    </div>
    <div class="fundraiser">
      <p><strong>Fundraising goal:</strong> $${e.goal_amount}
         &nbsp;&middot;&nbsp; <strong>Raised:</strong> $${e.raised_amount}
         &nbsp;&middot;&nbsp; <strong>Progress:</strong> ${progress}%</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    </div>
    <h3>Purpose</h3>
    <p>${e.mission || 'Not specified.'}</p>
    <h3>About this event</h3>
    <p>${e.description || 'No description provided.'}</p>
  `;
}
