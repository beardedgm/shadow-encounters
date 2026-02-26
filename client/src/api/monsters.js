import { authFetch } from './helpers';

const BASE = '/api/monsters';

export async function getMonsters(search = '') {
  const url = search ? `${BASE}?search=${encodeURIComponent(search)}` : BASE;
  const res = await authFetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getMonster(id) {
  const res = await authFetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createMonster(data) {
  const res = await authFetch(BASE, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function updateMonster(id, data) {
  const res = await authFetch(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteMonster(id) {
  const res = await authFetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
