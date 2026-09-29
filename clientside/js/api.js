// js/api.js
// Central wrapper around the fetch() calls to the Charity Events API.

const API_BASE = 'http://localhost:3000/api';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'API error');
  return json.data;
}

const API = {
  getHomeEvents: () => getJSON(`${API_BASE}/events`),
  searchEvents: (params) => {
    const q = new URLSearchParams(params).toString();
    return getJSON(`${API_BASE}/events/search?${q}`);
  },
  getEvent: (id) => getJSON(`${API_BASE}/events/${id}`),
  getCategories: () => getJSON(`${API_BASE}/categories`)
};
