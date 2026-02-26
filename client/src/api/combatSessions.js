const BASE = '/api/combat-sessions';

export async function getSessions(status = '') {
  const url = status ? `${BASE}?status=${status}` : BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getSession(id) {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createSession(encounterId, name) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encounterId, name }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function addCombatant(sessionId, data) {
  const res = await fetch(`${BASE}/${sessionId}/combatants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateCombatant(sessionId, combatantId, data) {
  const res = await fetch(`${BASE}/${sessionId}/combatants/${combatantId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function rollInitiative(sessionId) {
  const res = await fetch(`${BASE}/${sessionId}/roll-initiative`, { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function nextTurn(sessionId) {
  const res = await fetch(`${BASE}/${sessionId}/next-turn`, { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function completeCombat(sessionId) {
  const res = await fetch(`${BASE}/${sessionId}/complete`, { method: 'POST' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
