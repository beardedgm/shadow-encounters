import { authFetch } from './helpers';

export async function getUsage() {
  const res = await authFetch('/api/usage');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
