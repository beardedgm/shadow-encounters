import { useState, useEffect } from 'react';
import { getSessions } from '../api/combatSessions';

export default function EncounterHistory() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions('completed')
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="page">
      <h1>Encounter History</h1>
      {sessions.length === 0 && <p className="empty">No completed encounters yet.</p>}
      <div className="history-grid">
        {sessions.map((s) => (
          <div key={s._id} className="history-card">
            <h3>{s.name}</h3>
            <div className="history-stats">
              <div className="stat">
                <span className="stat-label">Rounds</span>
                <span className="stat-value">{s.round}</span>
              </div>
              <div className="stat">
                <span className="stat-label">XP Earned</span>
                <span className="stat-value">{s.totalXPEarned}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Combatants</span>
                <span className="stat-value">{s.combatants.length}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Defeated</span>
                <span className="stat-value">
                  {s.combatants.filter((c) => c.isDefeated).length}
                </span>
              </div>
            </div>
            {s.completedAt && (
              <p className="history-date">
                Completed: {new Date(s.completedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
