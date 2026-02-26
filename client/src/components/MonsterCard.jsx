import { Link } from 'react-router-dom';

export default function MonsterCard({ monster, compact = false }) {
  const formatAttacks = (attacks) =>
    attacks.map((a) => `${a.name} +${a.bonus} (${a.damage})`).join(', ');

  const modStr = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`);

  return (
    <div className="monster-card">
      <div className="monster-header">
        <Link to={`/monsters/${monster._id}`} className="monster-name">
          {monster.name}
        </Link>
        <span className="monster-level">Lv {monster.level}</span>
      </div>
      <div className="monster-stats">
        <span><strong>AC</strong> {monster.ac}</span>
        <span><strong>HP</strong> {monster.hp}</span>
        <span><strong>MV</strong> {monster.movement}</span>
        <span className="monster-alignment">{monster.alignment}</span>
      </div>
      {monster.attacks.length > 0 && (
        <div className="monster-attacks">
          <strong>ATK:</strong> {formatAttacks(monster.attacks)}
        </div>
      )}
      {!compact && (
        <>
          <div className="monster-mods">
            <span>S {modStr(monster.abilityModifiers.str)}</span>
            <span>D {modStr(monster.abilityModifiers.dex)}</span>
            <span>C {modStr(monster.abilityModifiers.con)}</span>
            <span>I {modStr(monster.abilityModifiers.int)}</span>
            <span>W {modStr(monster.abilityModifiers.wis)}</span>
            <span>Ch {modStr(monster.abilityModifiers.cha)}</span>
          </div>
          {monster.specialAbilities && (
            <div className="monster-abilities">{monster.specialAbilities}</div>
          )}
          <div className="monster-xp"><strong>XP:</strong> {monster.xp}</div>
        </>
      )}
    </div>
  );
}
