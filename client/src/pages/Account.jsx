import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../api/helpers';

export default function Account() {
  const { user, login, token } = useAuth();
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState('');

  const handleLinkPatreon = async () => {
    setLinking(true);
    setError('');
    try {
      const res = await authFetch('/api/patreon/link');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message);
      }
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err.message);
      setLinking(false);
    }
  };

  const handleUnlinkPatreon = async () => {
    try {
      const res = await authFetch('/api/patreon/unlink', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to unlink');
      const { user: updated } = await res.json();
      login(token, updated);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Account</h1>

      <div className="account-card">
        <h2>Profile</h2>
        <div className="account-field">
          <span className="account-label">Name</span>
          <span>{user?.name}</span>
        </div>
        <div className="account-field">
          <span className="account-label">Email</span>
          <span>{user?.email}</span>
        </div>
        <div className="account-field">
          <span className="account-label">Tier</span>
          <span className={`user-tier tier-${user?.tier}`}>{user?.tier}</span>
        </div>
      </div>

      <div className="account-card">
        <h2>Patreon Integration</h2>
        <p className="account-desc">
          Link your Patreon account to unlock Patron tier limits (40 monsters, 20 encounters, 10 active combats).
        </p>

        {error && <p className="auth-error">{error}</p>}

        {user?.patreonId ? (
          <div>
            <p className="account-status">
              Patreon linked since {new Date(user.patreonLinkedAt).toLocaleDateString()}
            </p>
            <button onClick={handleUnlinkPatreon} className="btn btn-danger">
              Unlink Patreon
            </button>
          </div>
        ) : (
          <button onClick={handleLinkPatreon} className="btn btn-primary" disabled={linking}>
            {linking ? 'Redirecting...' : 'Link Patreon Account'}
          </button>
        )}
      </div>
    </div>
  );
}
