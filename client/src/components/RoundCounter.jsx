export default function RoundCounter({ round, onNextTurn, onEndCombat }) {
  return (
    <div className="round-counter">
      <div className="round-display">
        <span className="round-label">Round</span>
        <span className="round-number">{round}</span>
      </div>
      <div className="round-actions">
        <button className="btn btn-primary" onClick={onNextTurn}>
          Next Turn &#8594;
        </button>
        <button className="btn btn-danger" onClick={onEndCombat}>
          End Combat
        </button>
      </div>
    </div>
  );
}
