const mongoose = require('mongoose');

const encounterMonsterSchema = new mongoose.Schema({
  monsterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Monster', required: true },
  quantity:  { type: Number, required: true, min: 1, default: 1 },
}, { _id: false });

const encounterSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  monsters:    { type: [encounterMonsterSchema], default: [] },
  totalXP:     { type: Number, default: 0 },
  status:      { type: String, enum: ['draft', 'ready', 'completed'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Encounter', encounterSchema);
