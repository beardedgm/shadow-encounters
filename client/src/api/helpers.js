export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (options.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, { ...options, headers });

  // Auto-logout on 401
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return res;
}
