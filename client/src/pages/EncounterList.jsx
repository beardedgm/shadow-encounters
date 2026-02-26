import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEncounters, deleteEncounter } from '../api/encounters';
import { createSession } from '../api/combatSessions';

export default function EncounterList() {
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getEncounters()
      .then(setEncounters)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete encounter "${name}"?`)) return;
    await deleteEncounter(id);
    setEncounters((prev) => prev.filter((e) => e._id !== id));
  };

  const handleStartCombat = async (encounter) => {
    const session = await createSession(encounter._id, encounter.name);
    navigate(`/combat/${session._id}`);
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Encounters</h1>
        <Link to="/encounters/new" className="btn btn-primary">+ New Encounter</Link>
      </div>
      {encounters.length === 0 && <p className="empty">No encounters yet. Build one!</p>}
      <div className="encounter-grid">
        {encounters.map((enc) => (
          <div key={enc._id} className="encounter-card">
            <div className="encounter-header">
              <h3>{enc.name}</h3>
              <span className="encounter-xp">{enc.totalXP} XP</span>
            </div>
            {enc.description && <p className="encounter-desc">{enc.description}</p>}
            <div className="encounter-meta">
              <span>{enc.monsters.length} monster type(s)</span>
              <span className={`status status-${enc.status}`}>{enc.status}</span>
            </div>
            <div className="encounter-actions">
              <button className="btn btn-primary btn-sm" onClick={() => handleStartCombat(enc)}>
                Start Combat
              </button>
              <Link to={`/encounters/${enc._id}`} className="btn btn-secondary btn-sm">Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(enc._id, enc.name)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
