import { useState, useEffect } from 'react';
import { getUsage } from '../api/usage';

export default function UsageBanner() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    getUsage().then(setUsage).catch(() => {});
  }, []);

  if (!usage) return null;

  const items = [
    { label: 'Monsters', current: usage.usage.monsters, max: usage.limits.monsters },
    { label: 'Encounters', current: usage.usage.encounters, max: usage.limits.encounters },
    { label: 'Active Combats', current: usage.usage.combatSessions, max: usage.limits.combatSessions },
  ];

  return (
    <div className="usage-banner">
      {items.map((item) => (
        <div key={item.label} className="usage-item">
          <span className="usage-label">{item.label}</span>
          <div className="usage-bar">
            <div
              className="usage-fill"
              style={{ width: `${Math.min((item.current / item.max) * 100, 100)}%` }}
            />
          </div>
          <span className="usage-count">{item.current}/{item.max}</span>
        </div>
      ))}
    </div>
  );
}
