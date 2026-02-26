export default function CombatantRow({ combatant, isCurrentTurn, onDamage, onHeal, onToggleDefeat }) {
  const hpPercent = combatant.maxHP > 0 ? (combatant.currentHP / combatant.maxHP) * 100 : 0;
  const hpColor = hpPercent > 50 ? 'var(--hp-high)' : hpPercent > 25 ? 'var(--hp-mid)' : 'var(--hp-low)';

  return (
    <div className={`combatant-row ${isCurrentTurn ? 'current-turn' : ''} ${combatant.isDefeated ? 'defeated' : ''}`}>
      <div className="combatant-turn">
        {isCurrentTurn && !combatant.isDefeated && <span className="turn-indicator">&#9654;</span>}
      </div>
      <div className="combatant-init">{combatant.initiative}</div>
      <div className="combatant-info">
        <span className="combatant-name">
          {combatant.name}
          <span className={`combatant-type type-${combatant.type}`}>
            {combatant.type === 'pc' ? 'PC' : 'MON'}
          </span>
        </span>
        <span className="combatant-ac">AC {combatant.ac}</span>
      </div>
      <div className="combatant-hp">
        <div className="hp-bar">
          <div className="hp-fill" style={{ width: `${hpPercent}%`, backgroundColor: hpColor }} />
        </div>
        <span className="hp-text">{combatant.currentHP}/{combatant.maxHP}</span>
      </div>
      <div className="combatant-actions">
        {!combatant.isDefeated && (
          <>
            <button className="btn btn-danger btn-sm" onClick={() => onDamage(combatant)}>DMG</button>
            <button className="btn btn-success btn-sm" onClick={() => onHeal(combatant)}>HEAL</button>
          </>
        )}
        <button
          className={`btn btn-sm ${combatant.isDefeated ? 'btn-secondary' : 'btn-warning'}`}
          onClick={() => onToggleDefeat(combatant)}
        >
          {combatant.isDefeated ? 'Revive' : 'Defeat'}
        </button>
      </div>
    </div>
  );
}
