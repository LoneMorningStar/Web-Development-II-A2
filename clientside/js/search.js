// js/search.js
// Handles the Search page: populates the category dropdown and filters events.

document.addEventListener('DOMContentLoaded', async () => {
  await loadCategories();
  document.getElementById('search-form').addEventListener('submit', onSearch);
  document.getElementById('clear-btn').addEventListener('click', clearFilters);
  document.getElementById('results').addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-event-id]');
    if (btn) openEventModal(btn.dataset.eventId);
  });
});

async function loadCategories() {
  const sel = document.getElementById('category');
  try {
    const cats = await API.getCategories();
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.category_id;
      opt.textContent = c.category_name;
      sel.appendChild(opt);
    });
  } catch (err) {
    showError('Failed to load categories: ' + err.message);
  }
}

async function onSearch(e) {
  e.preventDefault();
  clearError();

  const params = {};
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value.trim();
  const category = document.getElementById('category').value;
  if (date) params.date = date;
  if (location) params.location = location;
  if (category) params.category = category;

  if (Object.keys(params).length === 0) {
    showError('Please select at least one filter.');
    return;
  }

  const results = document.getElementById('results');
  results.innerHTML = '<p class="loading">Searching...</p>';
  try {
    const events = await API.searchEvents(params);
    results.innerHTML = events.length
      ? events.map(renderResult).join('')
      : '<p>No matching events.</p>';
  } catch (err) {
    results.innerHTML = '';
    showError('Search failed: ' + err.message);
  }
}

function clearFilters() {
  document.getElementById('search-form').reset();
  document.getElementById('results').innerHTML = '';
  clearError();
}

function showError(msg) { document.getElementById('error').textContent = msg; }
function clearError()   { document.getElementById('error').textContent = ''; }

function renderResult(e) {
  const date = new Date(e.event_date).toLocaleDateString();
  return `
    <div class="card row-card">
      <div class="card-body">
        <span class="badge">${e.category_name}</span>
        <h3>${e.event_name}</h3>
        <p class="meta">${date} &middot; ${e.location}</p>
        <button class="btn" data-event-id="${e.event_id}">View details &rarr;</button>
      </div>
    </div>
  `;
}
