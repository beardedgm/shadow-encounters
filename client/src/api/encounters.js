import { authFetch } from './helpers';

const BASE = '/api/encounters';

export async function getEncounters() {
  const res = await authFetch(BASE);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getEncounter(id) {
  const res = await authFetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createEncounter(data) {
  const res = await authFetch(BASE, {
    method: 'POST',

    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateEncounter(id, data) {
  const res = await authFetch(`${BASE}/${id}`, {
    method: 'PUT',

    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteEncounter(id) {
  const res = await authFetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
