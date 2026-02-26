import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMonsters } from '../api/monsters';
import MonsterCard from '../components/MonsterCard';

export default function MonsterLibrary() {
  const [monsters, setMonsters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      getMonsters(search)
        .then(setMonsters)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, 300); // debounce search

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Monster Library</h1>
        <Link to="/monsters/new" className="btn btn-primary">+ New Monster</Link>
      </div>
      <input
        className="search-input"
        placeholder="Search monsters..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && monsters.length === 0 && <p className="empty">No monsters found.</p>}
      <div className="monster-grid">
        {monsters.map((m) => (
          <MonsterCard key={m._id} monster={m} compact />
        ))}
      </div>
    </div>
  );
}
