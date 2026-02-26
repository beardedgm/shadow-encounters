import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSession,
  addCombatant,
  updateCombatant,
  rollInitiative,
  nextTurn,
  completeCombat,
} from '../api/combatSessions';
import InitiativeList from '../components/InitiativeList';
import AddPCForm from '../components/AddPCForm';
import DamageHealModal from '../components/DamageHealModal';
import RoundCounter from '../components/RoundCounter';

export default function CombatTracker() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalState, setModalState] = useState({ combatant: null, mode: null });

  useEffect(() => {
    getSession(sessionId)
      .then(setSession)
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleAddPC = async (pcData) => {
    const updated = await addCombatant(sessionId, pcData);
    setSession(updated);
  };

  const handleRollInitiative = async () => {
    const updated = await rollInitiative(sessionId);
    setSession(updated);
  };

  const handleNextTurn = async () => {
    const updated = await nextTurn(sessionId);
    setSession(updated);
  };

  const handleEndCombat = async () => {
    if (!window.confirm('End this combat?')) return;
    const updated = await completeCombat(sessionId);
    setSession(updated);
    navigate('/history');
  };

  const handleDamage = (combatant) => setModalState({ combatant, mode: 'damage' });
  const handleHeal = (combatant) => setModalState({ combatant, mode: 'heal' });

  const handleApplyModal = async (combatant, amount, mode) => {
    const newHP = mode === 'damage'
      ? combatant.currentHP - amount
      : combatant.currentHP + amount;
    const updated = await updateCombatant(sessionId, combatant._id, {
      currentHP: Math.max(0, Math.min(newHP, combatant.maxHP)),
    });
    setSession(updated);
  };

  const handleToggleDefeat = async (combatant) => {
    const updated = await updateCombatant(sessionId, combatant._id, {
      isDefeated: !combatant.isDefeated,
      currentHP: combatant.isDefeated ? 1 : 0,
    });
    setSession(updated);
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!session) return <p className="error">Session not found.</p>;
  if (session.status === 'completed') {
    return (
      <div className="page">
        <h1>Combat Complete</h1>
        <p>This combat has ended. XP earned: {session.totalXPEarned}</p>
        <button className="btn btn-primary" onClick={() => navigate('/history')}>View History</button>
      </div>
    );
  }

  return (
    <div className="page combat-page">
      <div className="combat-header">
        <h1>{session.name}</h1>
        <RoundCounter
          round={session.round}
          onNextTurn={handleNextTurn}
          onEndCombat={handleEndCombat}
        />
      </div>

      <div className="combat-controls">
        <button className="btn btn-accent" onClick={handleRollInitiative}>
          Roll Initiative
        </button>
      </div>

      <AddPCForm onAdd={handleAddPC} />

      {session.combatants.length > 0 ? (
        <InitiativeList
          combatants={session.combatants}
          currentTurnIndex={session.currentTurnIndex}
          onDamage={handleDamage}
          onHeal={handleHeal}
          onToggleDefeat={handleToggleDefeat}
        />
      ) : (
        <p className="empty">No combatants yet. Add PCs or roll initiative to begin.</p>
      )}

      <DamageHealModal
        combatant={modalState.combatant}
        mode={modalState.mode}
        onApply={handleApplyModal}
        onClose={() => setModalState({ combatant: null, mode: null })}
      />
    </div>
  );
}
