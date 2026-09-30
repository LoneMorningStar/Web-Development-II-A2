// js/event.js
// Loads a single event by id (from the URL query string) and renders its detail.

document.addEventListener('DOMContentLoaded', loadEvent);

var DETAIL_SKELETON =
  '<div class="detail-header">' +
    '<div class="detail-media skeleton"></div>' +
    '<div class="detail-head">' +
      '<div class="skeleton skeleton__line" style="height:28px;width:66%"></div>' +
      '<div class="skeleton skeleton__line" style="width:40%"></div>' +
      '<div class="skeleton skeleton__line"></div>' +
      '<div class="skeleton skeleton__line"></div>' +
      '<div class="skeleton skeleton__line"></div>' +
    '</div>' +
  '</div>';

async function loadEvent() {
  var query = new URLSearchParams(window.location.search);
  var hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  var id = query.get('id') || hash.get('id');
  var container = document.getElementById('event-detail');

  if (!id || !/^\d+$/.test(id)) {
    container.innerHTML = '<p class="error-block">Invalid event id.</p>';
    return;
  }

  container.innerHTML = DETAIL_SKELETON;

  try {
    var e = await API.getEvent(id);
    container.innerHTML = renderDetail(e);
    observeReveals(container);

    document.getElementById('register-btn').addEventListener('click', openModal);
    document.getElementById('modal-close').addEventListener('click', closeModal);
    document.getElementById('modal-close-btn').addEventListener('click', closeModal);
    bindModal();
  } catch (err) {
    if (String(err.message).indexOf('404') !== -1) {
      container.innerHTML =
        '<div class="message">' +
          '<p>Event not found.</p>' +
          '<a class="back-link" href="search.html">' + ICO.arrowLeft(16) + ' Back to search</a>' +
        '</div>';
    } else {
      container.innerHTML =
        '<div class="message">' +
          '<p>Could not load this event. Please try again later.</p>' +
          '<button class="btn btn--outline" type="button" onclick="loadEvent()">Retry</button>' +
        '</div>';
    }
  }
}

function renderDetail(e) {
  var dateTime = new Date(e.event_date).toLocaleString();
  var price = Number(e.ticket_price) > 0
    ? '$' + Number(e.ticket_price).toFixed(2) + ' per ticket'
    : 'Free entry';
  var progress = Number(e.goal_amount) > 0
    ? Math.min(100, (Number(e.raised_amount) / Number(e.goal_amount)) * 100).toFixed(1)
    : '0.0';
  var raised = '$' + Number(e.raised_amount).toFixed(2);
  var goal = '$' + Number(e.goal_amount).toFixed(2);
  var contact = [e.contact_email, e.contact_phone].filter(Boolean).join(' &middot; ');

  var media = e.image_url
    ? '<img src="' + esc(e.image_url) + '" alt="' + esc(e.event_name) + '" onerror="this.onerror=null;this.src=\'images/placeholder.svg\';">'
    : '<span class="detail-media--empty">' + ICO.flower(48) + '</span>';

  return (
    '<a class="back-link" href="search.html">' + ICO.arrowLeft(16) + ' Back to search</a>' +

    '<div class="detail-header" data-reveal>' +
      '<div class="detail-media">' + media +
        '<span class="card__tag">' + esc(e.category_name) + '</span>' +
      '</div>' +
      '<div class="detail-head">' +
        '<p class="eyebrow">Charity event</p>' +
        '<h1 class="detail-head__title">' + esc(e.event_name) + '</h1>' +
        '<p class="detail-head__org">Hosted by ' + esc(e.org_name) + '</p>' +
        '<ul class="detail-head__meta">' +
          '<li>' + ICO.calendar(16) + '<span>' + dateTime + '</span></li>' +
          '<li>' + ICO.mapPin(16) + '<span>' + esc(e.location) + '</span></li>' +
          '<li>' + ICO.ticket(16) + '<span>' + price + '</span></li>' +
        '</ul>' +
        '<button id="register-btn" class="btn btn--solid" type="button">Register</button>' +
      '</div>' +
    '</div>' +

    '<div class="detail-sections">' +
      '<section class="detail-section" data-reveal>' +
        '<p class="eyebrow">Purpose</p>' +
        '<h2 class="display">About this event</h2>' +
        '<p>' + esc(e.description || 'No description provided.') + '</p>' +
      '</section>' +
      '<section class="detail-section" data-reveal>' +
        '<p class="eyebrow">Organisation</p>' +
        '<h2 class="display">Who you are supporting</h2>' +
        '<p>' + esc(e.mission || 'Mission details coming soon.') + '</p>' +
        (contact ? '<p class="contact-line">' + esc(contact) + '</p>' : '') +
      '</section>' +
      '<section class="detail-section" data-reveal>' +
        '<p class="eyebrow">Impact</p>' +
        '<h2 class="display">Goal vs. progress</h2>' +
        '<div class="goal-card">' +
          '<div class="goal-card__row">' +
            '<div>' +
              '<div class="goal-card__label">Raised</div>' +
              '<div class="goal-card__raised">' + raised + '</div>' +
            '</div>' +
            '<div style="text-align:right">' +
              '<div class="goal-card__label">Goal</div>' +
              '<div class="goal-card__goal">' + goal + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="progress"><div class="progress__fill" style="width:' + progress + '%"></div></div>' +
          '<p class="goal-card__pct">' + progress + '% funded</p>' +
        '</div>' +
      '</section>' +
    '</div>'
  );
}

/* ---------- Modal ---------- */
function openModal() {
  document.getElementById('modal').classList.add('is-open');
  document.body.classList.add('modal-open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('is-open');
  document.body.classList.remove('modal-open');
}

function bindModal() {
  var modal = document.getElementById('modal');
  // Backdrop click closes
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  // Escape key closes
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}
