const mongoose = require('mongoose');

const attackSchema = new mongoose.Schema({
  name:   { type: String, required: true },
  bonus:  { type: Number, required: true },
  damage: { type: String, required: true },
}, { _id: false });

const monsterSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  level:            { type: Number, required: true, min: 0, max: 30 },
  ac:               { type: Number, required: true },
  hp:               { type: Number, required: true },
  attacks:          { type: [attackSchema], default: [] },
  movement:         { type: String, default: 'near' },
  abilityModifiers: {
    str: { type: Number, default: 0 },
    dex: { type: Number, default: 0 },
    con: { type: Number, default: 0 },
    int: { type: Number, default: 0 },
    wis: { type: Number, default: 0 },
    cha: { type: Number, default: 0 },
  },
  alignment:        { type: String, enum: ['L', 'N', 'C'], default: 'N' },
  specialAbilities: { type: String, default: '' },
  xp:               { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Monster', monsterSchema);
