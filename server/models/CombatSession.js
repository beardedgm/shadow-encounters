const mongoose = require('mongoose');

const combatantSchema = new mongoose.Schema({
  name:            { type: String, required: true },
  type:            { type: String, enum: ['pc', 'monster'], required: true },
  monsterId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Monster', default: null },
  ac:              { type: Number, required: true },
  maxHP:           { type: Number, required: true },
  currentHP:       { type: Number, required: true },
  initiative:      { type: Number, default: 0 },
  initiativeBonus: { type: Number, default: 0 },
  isDefeated:      { type: Boolean, default: false },
  conditions:      { type: [String], default: [] },
});

const combatSessionSchema = new mongoose.Schema({
  userId:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  encounterId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Encounter', default: null },
  name:             { type: String, required: true },
  combatants:       { type: [combatantSchema], default: [] },
  currentTurnIndex: { type: Number, default: 0 },
  round:            { type: Number, default: 1 },
  status:           { type: String, enum: ['active', 'completed'], default: 'active' },
  totalXPEarned:    { type: Number, default: 0 },
  completedAt:      { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('CombatSession', combatSessionSchema);
