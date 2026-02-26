import { useState, useEffect } from 'react';

const emptyAttack = { name: '', bonus: 0, damage: '' };

const emptyMonster = {
  name: '',
  level: 1,
  ac: 10,
  hp: 5,
  attacks: [{ ...emptyAttack }],
  movement: 'near',
  abilityModifiers: { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 },
  alignment: 'N',
  specialAbilities: '',
  xp: 2,
};

export default function MonsterForm({ initial, onSubmit, submitLabel = 'Save Monster' }) {
  const [form, setForm] = useState(initial || emptyMonster);

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleModChange = (stat, value) => {
    setForm((prev) => ({
      ...prev,
      abilityModifiers: { ...prev.abilityModifiers, [stat]: Number(value) },
    }));
  };

  const handleAttackChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      attacks: prev.attacks.map((a, i) =>
        i === index ? { ...a, [field]: field === 'bonus' ? Number(value) : value } : a
      ),
    }));
  };

  const addAttack = () => setForm((prev) => ({ ...prev, attacks: [...prev.attacks, { ...emptyAttack }] }));
  const removeAttack = (index) => setForm((prev) => ({ ...prev, attacks: prev.attacks.filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="monster-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Level
          <input name="level" type="number" min="0" max="30" value={form.level} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row">
        <label>
          AC
          <input name="ac" type="number" value={form.ac} onChange={handleChange} />
        </label>
        <label>
          HP
          <input name="hp" type="number" min="1" value={form.hp} onChange={handleChange} />
        </label>
        <label>
          Movement
          <input name="movement" value={form.movement} onChange={handleChange} />
        </label>
        <label>
          XP
          <input name="xp" type="number" min="0" value={form.xp} onChange={handleChange} />
        </label>
      </div>

      <div className="form-row">
        <label>
          Alignment
          <select name="alignment" value={form.alignment} onChange={handleChange}>
            <option value="L">Lawful</option>
            <option value="N">Neutral</option>
            <option value="C">Chaotic</option>
          </select>
        </label>
      </div>

      <fieldset className="form-fieldset">
        <legend>Ability Modifiers</legend>
        <div className="form-row mods-row">
          {['str', 'dex', 'con', 'int', 'wis', 'cha'].map((stat) => (
            <label key={stat}>
              {stat.toUpperCase()}
              <input
                type="number"
                min="-5"
                max="10"
                value={form.abilityModifiers[stat]}
                onChange={(e) => handleModChange(stat, e.target.value)}
              />
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form-fieldset">
        <legend>Attacks</legend>
        {form.attacks.map((atk, i) => (
          <div key={i} className="form-row attack-row">
            <input
              placeholder="Name"
              value={atk.name}
              onChange={(e) => handleAttackChange(i, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Bonus"
              value={atk.bonus}
              onChange={(e) => handleAttackChange(i, 'bonus', e.target.value)}
            />
            <input
              placeholder="Damage (e.g. 1d6)"
              value={atk.damage}
              onChange={(e) => handleAttackChange(i, 'damage', e.target.value)}
              required
            />
            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeAttack(i)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary btn-sm" onClick={addAttack}>
          + Add Attack
        </button>
      </fieldset>

      <label>
        Special Abilities
        <textarea
          name="specialAbilities"
          value={form.specialAbilities}
          onChange={handleChange}
          rows={3}
        />
      </label>

      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}
