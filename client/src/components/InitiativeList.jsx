import CombatantRow from './CombatantRow';

export default function InitiativeList({ combatants, currentTurnIndex, onDamage, onHeal, onToggleDefeat }) {
  return (
    <div className="initiative-list">
      <div className="initiative-header">
        <span></span>
        <span>Init</span>
        <span>Name</span>
        <span>HP</span>
        <span>Actions</span>
      </div>
      {combatants.map((c, index) => (
        <CombatantRow
          key={c._id}
          combatant={c}
          isCurrentTurn={index === currentTurnIndex}
          onDamage={onDamage}
          onHeal={onHeal}
          onToggleDefeat={onToggleDefeat}
        />
      ))}
    </div>
  );
}
