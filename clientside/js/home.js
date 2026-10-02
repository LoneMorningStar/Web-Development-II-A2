document.addEventListener('DOMContentLoaded', loadHome);

var HOME_SKELETON = Array.from({ length: 3 }, function () {
  return '<div class="skeleton"><div class="skeleton__media"></div>' +
    '<div class="skeleton__line"></div>' +
    '<div class="skeleton__line skeleton__line--short"></div></div>';
}).join('');

async function loadHome() {
  var list = document.getElementById('event-list');
  list.innerHTML = HOME_SKELETON;

  try {
    var events = await API.getHomeEvents();
    if (events.length === 0) {
      list.innerHTML = '<p class="results-empty">No upcoming events right now. Check back soon.</p>';
      return;
    }
    list.innerHTML = events.map(function (e, i) {
      return renderCard(e, i * 80);
    }).join('');
    observeReveals(list);
  } catch (err) {
    list.innerHTML =
      '<div class="message">' +
      '<p>Could not load events. Please try again later.</p>' +
      '<button class="btn btn--outline" type="button" onclick="loadHome()">Retry</button>' +
      '</div>';
  }
}

function renderCard(e, delay) {
  var date = new Date(e.event_date).toLocaleDateString();
  var status = e.status === 'past' ? 'Past' : 'Upcoming';
  var media = e.image_url
    ? '<img src="' + esc(e.image_url) + '" alt="' + esc(e.event_name) + '" loading="lazy" onerror="this.onerror=null;this.src=\'images/placeholder.svg\';">'
    : '<span class="card__media--empty">' + ICO.flower(32) + '</span>';

  return (
    '<a class="card" href="event.html#id=' + e.event_id + '" data-reveal style="transition-delay:' + delay + 'ms">' +
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
