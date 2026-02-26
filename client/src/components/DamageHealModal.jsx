import { useState } from 'react';

export default function DamageHealModal({ combatant, mode, onApply, onClose }) {
  const [amount, setAmount] = useState(0);

  if (!combatant) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount <= 0) return;
    onApply(combatant, amount, mode);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{mode === 'damage' ? 'Deal Damage' : 'Heal'} — {combatant.name}</h3>
        <p className="modal-hp">Current HP: {combatant.currentHP}/{combatant.maxHP}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            min="1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            autoFocus
          />
          <div className="modal-actions">
            <button
              type="submit"
              className={`btn ${mode === 'damage' ? 'btn-danger' : 'btn-success'}`}
            >
              {mode === 'damage' ? 'Apply Damage' : 'Apply Healing'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
