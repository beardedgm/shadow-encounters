import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMonsters } from '../api/monsters';
import { createEncounter, getEncounter, updateEncounter } from '../api/encounters';

export default function EncounterBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selected, setSelected] = useState([]); // [{ monster, quantity }]
  const [allMonsters, setAllMonsters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonsters().then(setAllMonsters).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isEdit) {
      getEncounter(id).then((enc) => {
        setName(enc.name);
        setDescription(enc.description || '');
        setSelected(
          enc.monsters
            .filter((m) => m.monsterId)
            .map((m) => ({ monster: m.monsterId, quantity: m.quantity }))
        );
      });
    }
  }, [id, isEdit]);

  const filteredMonsters = allMonsters.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const addMonster = (monster) => {
    setSelected((prev) => {
      const existing = prev.find((s) => s.monster._id === monster._id);
      if (existing) {
        return prev.map((s) =>
          s.monster._id === monster._id ? { ...s, quantity: s.quantity + 1 } : s
        );
      }
      return [...prev, { monster, quantity: 1 }];
    });
  };

  const updateQuantity = (monsterId, delta) => {
    setSelected((prev) =>
      prev
        .map((s) => (s.monster._id === monsterId ? { ...s, quantity: s.quantity + delta } : s))
        .filter((s) => s.quantity > 0)
    );
  };

  const totalXP = selected.reduce((sum, s) => sum + s.monster.xp * s.quantity, 0);

  const handleSave = async () => {
    if (!name.trim()) return alert('Enter an encounter name');

    const data = {
      name,
      description,
      monsters: selected.map((s) => ({ monsterId: s.monster._id, quantity: s.quantity })),
      totalXP,
      status: 'ready',
    };

    if (isEdit) {
      await updateEncounter(id, data);
    } else {
      await createEncounter(data);
    }
    navigate('/encounters');
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="page">
      <h1>{isEdit ? 'Edit Encounter' : 'Build Encounter'}</h1>

      <div className="form-row">
        <label>
          Encounter Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Description (optional)
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
      </div>

      <div className="encounter-builder">
        <div className="builder-panel">
          <h3>Monster Library</h3>
          <input
            className="search-input"
            placeholder="Filter monsters..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="builder-monster-list">
            {filteredMonsters.map((m) => (
              <div key={m._id} className="builder-monster-item" onClick={() => addMonster(m)}>
                <span>{m.name}</span>
                <span className="monster-meta">Lv{m.level} | AC {m.ac} | HP {m.hp} | {m.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className="builder-panel selected-panel">
          <h3>Selected Monsters</h3>
          {selected.length === 0 && <p className="empty">Click monsters to add them</p>}
          {selected.map((s) => (
            <div key={s.monster._id} className="selected-monster">
              <span className="selected-name">{s.monster.name}</span>
              <div className="quantity-controls">
                <button className="btn btn-sm" onClick={() => updateQuantity(s.monster._id, -1)}>-</button>
                <span className="quantity">{s.quantity}</span>
                <button className="btn btn-sm" onClick={() => updateQuantity(s.monster._id, 1)}>+</button>
              </div>
              <span className="selected-xp">{s.monster.xp * s.quantity} XP</span>
            </div>
          ))}
          <div className="encounter-total">
            <strong>Total XP: {totalXP}</strong>
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            {isEdit ? 'Update Encounter' : 'Save Encounter'}
          </button>
        </div>
      </div>
    </div>
  );
}
