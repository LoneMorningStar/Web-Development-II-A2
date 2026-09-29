// js/event.js
// Loads a single event by id (from the URL query string) and renders its detail.

document.addEventListener('DOMContentLoaded', loadEvent);

async function loadEvent() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('event-detail');

  if (!id || !/^\d+$/.test(id)) {
    container.innerHTML = '';
    document.getElementById('error').textContent = 'Invalid event id.';
    return;
  }

  try {
    const e = await API.getEvent(id);
    container.innerHTML = renderDetail(e);
    document.getElementById('register-btn').addEventListener('click', openModal);
    document.getElementById('close-modal').addEventListener('click', closeModal);
  } catch (err) {
    container.innerHTML = '';
    document.getElementById('error').textContent = 'Failed to load event: ' + err.message;
  }
}

function renderDetail(e) {
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
    <h1>${e.event_name}</h1>
    <p class="detail-sub"><span class="badge">${e.category_name}</span>
      <span class="status ${e.status}">${e.status}</span></p>

    <div class="detail-grid">
      <p><strong>Organisation:</strong> ${e.org_name}</p>
      <p><strong>Category:</strong> ${e.category_name}</p>
      <p><strong>Time:</strong> ${date}</p>
      <p><strong>Location:</strong> ${e.location}</p>
      <p><strong>Ticket:</strong> ${price}</p>
      <p><strong>Contact:</strong> ${e.contact_email || '—'} ${e.contact_phone ? '| ' + e.contact_phone : ''}</p>
    </div>

    <div class="fundraiser">
      <p><strong>Fundraising goal:</strong> $${e.goal_amount}
         &nbsp;&middot;&nbsp; <strong>Raised:</strong> $${e.raised_amount}
         &nbsp;&middot;&nbsp; <strong>Progress:</strong> ${progress}%</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${progress}%"></div></div>
    </div>

    <h2>Purpose</h2>
    <p>${e.mission || 'Not specified.'}</p>

    <h2>About this event</h2>
    <p>${e.description || 'No description provided.'}</p>

    <button id="register-btn" class="btn btn-primary">Register</button>
  `;
}

function openModal()  { document.getElementById('modal').classList.remove('hidden'); }
function closeModal() { document.getElementById('modal').classList.add('hidden'); }
