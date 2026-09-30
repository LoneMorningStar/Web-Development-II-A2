// js/search.js
// Handles the Search page: populates the category dropdown, validates and
// filters events, and renders results.

document.addEventListener('DOMContentLoaded', async function () {
  await loadCategories();
  document.getElementById('search-form').addEventListener('submit', onSearch);
  document.getElementById('clear-btn').addEventListener('click', clearFilters);
  document.getElementById('results').innerHTML =
    '<p class="results-hint">Use the form above to search for events.</p>';
});

var SEARCH_SKELETON = Array.from({ length: 3 }, function () {
  return '<div class="skeleton"><div class="skeleton__media"></div>' +
    '<div class="skeleton__line"></div>' +
    '<div class="skeleton__line skeleton__line--short"></div></div>';
}).join('');

async function loadCategories() {
  var sel = document.getElementById('category');
  try {
    var cats = await API.getCategories();
    cats.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.category_id;
      opt.textContent = c.category_name;
      sel.appendChild(opt);
    });
  } catch (err) {
    showError('Failed to load categories: ' + err.message);
  }
}

function isPastDate(dateStr) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dateStr + 'T00:00:00') < today;
}

async function onSearch(e) {
  e.preventDefault();
  clearError();

  var params = {};
  var date = document.getElementById('date').value;
  var location = document.getElementById('location').value.trim();
  var category = document.getElementById('category').value;

  if (date && isPastDate(date)) {
    showError('Please pick today or a future date.');
    return;
  }

  if (date) params.date = date;
  if (location) params.location = location;
  if (category) params.category = category;

  if (Object.keys(params).length === 0) {
    showError('Please select at least one filter.');
    return;
  }

  var results = document.getElementById('results');
  results.innerHTML = SEARCH_SKELETON;
  setTitle('Matching events');

  try {
    var events = await API.searchEvents(params);
    if (events.length === 0) {
      results.innerHTML = '<p class="results-empty">No matching events. Try adjusting your filters.</p>';
      setTitle('Matching events');
      return;
    }
    results.innerHTML = events.map(function (ev, i) {
      return renderResult(ev, i * 80);
    }).join('');
    setTitle(events.length + (events.length === 1 ? ' event found' : ' events found'));
    observeReveals(results);
  } catch (err) {
    results.innerHTML = '';
    setTitle('Matching events');
    showError('Search failed: ' + err.message);
  }
}

function clearFilters() {
  document.getElementById('search-form').reset();
  document.getElementById('results').innerHTML =
    '<p class="results-hint">Use the form above to search for events.</p>';
  setTitle('Matching events');
  clearError();
}

function setTitle(text) {
  document.getElementById('results-title').textContent = text;
}

function showError(msg) { document.getElementById('error').textContent = msg; }
function clearError()   { document.getElementById('error').textContent = ''; }

function renderResult(e, delay) {
  var date = new Date(e.event_date).toLocaleDateString();
  var status = e.status === 'past' ? 'Past' : 'Upcoming';
  var media = e.image_url
    ? '<img src="' + esc(e.image_url) + '" alt="' + esc(e.event_name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'images/placeholder.svg\';">'
    : '<span class="card__media--empty">' + ICO.flower(32) + '</span>';

  return (
    '<a class="card" href="event.html?id=' + e.event_id + '" data-reveal style="transition-delay:' + delay + 'ms">' +
      '<div class="card__media">' + media +
        '<span class="card__tag">' + esc(e.category_name) + '</span>' +
      '</div>' +
      '<div class="card__body">' +
        '<h3 class="card__name">' + esc(e.event_name) + '</h3>' +
        '<div class="card__meta">' +
          '<span>' + ICO.calendar(14) + date + '</span>' +
          '<span>' + ICO.mapPin(14) + esc(e.location) + '</span>' +
        '</div>' +
        '<div class="card__foot">' +
          '<span class="card__status">' + status + '</span>' +
          '<span class="card__arrow">' + ICO.arrowRight(16) + '</span>' +
        '</div>' +
      '</div>' +
    '</a>'
  );
}
