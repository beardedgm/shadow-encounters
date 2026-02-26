import { useState } from 'react';

export default function AddPCForm({ onAdd }) {
  const [form, setForm] = useState({ name: '', ac: 10, maxHP: 10, initiativeBonus: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: '', ac: 10, maxHP: 10, initiativeBonus: 0 });
  };

  return (
    <form className="add-pc-form" onSubmit={handleSubmit}>
      <h3>Add Player Character</h3>
      <div className="form-row">
        <input
          placeholder="Character Name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
        />
        <label>
          AC
          <input
            type="number"
            value={form.ac}
            onChange={(e) => setForm((p) => ({ ...p, ac: Number(e.target.value) }))}
          />
        </label>
        <label>
          HP
          <input
            type="number"
            min="1"
            value={form.maxHP}
            onChange={(e) => setForm((p) => ({ ...p, maxHP: Number(e.target.value) }))}
          />
        </label>
        <label>
          DEX mod
          <input
            type="number"
            value={form.initiativeBonus}
            onChange={(e) => setForm((p) => ({ ...p, initiativeBonus: Number(e.target.value) }))}
          />
        </label>
        <button type="submit" className="btn btn-primary btn-sm">Add PC</button>
      </div>
    </form>
  );
}
