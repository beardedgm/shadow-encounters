import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSessions } from '../api/combatSessions';

export default function CombatActive() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getSessions('active')
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="page">
      <h1>Active Combat Sessions</h1>
      {sessions.length === 0 && (
        <div className="empty">
          <p>No active combats. Start one from the Encounters page.</p>
          <Link to="/encounters" className="btn btn-primary">Go to Encounters</Link>
        </div>
      )}
      <div className="session-grid">
        {sessions.map((s) => (
          <div key={s._id} className="session-card" onClick={() => navigate(`/combat/${s._id}`)}>
            <h3>{s.name}</h3>
            <div className="session-meta">
              <span>Round {s.round}</span>
              <span>{s.combatants.length} combatants</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
