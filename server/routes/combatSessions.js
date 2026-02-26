const router = require('express').Router();
const auth = require('../middleware/auth');
const { checkLimit } = require('../middleware/checkLimit');
const CombatSession = require('../models/CombatSession');
const Encounter = require('../models/Encounter');
const Monster = require('../models/Monster');

router.use(auth);

// GET /api/combat-sessions?status=active
router.get('/', async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    const sessions = await CombatSession.find(filter).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    next(err);
  }
});

// GET /api/combat-sessions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const session = await CombatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/combat-sessions — create from an encounter
router.post('/', checkLimit('combatSessions'), async (req, res, next) => {
  try {
    const { encounterId, name } = req.body;

    // Verify encounter belongs to this user
    const encounter = await Encounter.findOne({ _id: encounterId, userId: req.user._id })
      .populate('monsters.monsterId');
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });

    // Expand monsters into individual combatants
    const combatants = [];
    for (const entry of encounter.monsters) {
      const monster = entry.monsterId;
      if (!monster) continue;
      for (let i = 1; i <= entry.quantity; i++) {
        const label = entry.quantity > 1 ? `${monster.name} ${i}` : monster.name;
        combatants.push({
          name: label,
          type: 'monster',
          monsterId: monster._id,
          ac: monster.ac,
          maxHP: monster.hp,
          currentHP: monster.hp,
          initiativeBonus: monster.abilityModifiers?.dex || 0,
          isDefeated: false,
        });
      }
    }

    const session = await CombatSession.create({
      userId: req.user._id,
      encounterId,
      name: name || encounter.name,
      combatants,
      totalXPEarned: encounter.totalXP,
    });

    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/combat-sessions/:id/combatants — add a PC
router.post('/:id/combatants', async (req, res, next) => {
  try {
    const session = await CombatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const { name, ac, maxHP, initiativeBonus } = req.body;
    session.combatants.push({
      name,
      type: 'pc',
      ac,
      maxHP,
      currentHP: maxHP,
      initiativeBonus: initiativeBonus || 0,
      isDefeated: false,
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/combat-sessions/:id/combatants/:combatantId
router.patch('/:id/combatants/:combatantId', async (req, res, next) => {
  try {
    const session = await CombatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const combatant = session.combatants.id(req.params.combatantId);
    if (!combatant) return res.status(404).json({ message: 'Combatant not found' });

    const { currentHP, isDefeated, initiative, conditions } = req.body;
    if (currentHP !== undefined) combatant.currentHP = Math.max(0, Math.min(currentHP, combatant.maxHP));
    if (isDefeated !== undefined) combatant.isDefeated = isDefeated;
    if (initiative !== undefined) combatant.initiative = initiative;
    if (conditions !== undefined) combatant.conditions = conditions;

    // Auto-defeat at 0 HP
    if (combatant.currentHP === 0) combatant.isDefeated = true;

    await session.save();
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/combat-sessions/:id/roll-initiative
router.post('/:id/roll-initiative', async (req, res, next) => {
  try {
    const session = await CombatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    session.combatants.forEach((c) => {
      const roll = Math.floor(Math.random() * 20) + 1;
      c.initiative = roll + c.initiativeBonus;
    });

    session.combatants.sort((a, b) => b.initiative - a.initiative);
    session.currentTurnIndex = 0;
    session.round = 1;

    await session.save();
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/combat-sessions/:id/next-turn
router.post('/:id/next-turn', async (req, res, next) => {
  try {
    const session = await CombatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const total = session.combatants.length;
    if (total === 0) return res.json(session);

    let nextIndex = session.currentTurnIndex;
    let checked = 0;

    do {
      nextIndex = (nextIndex + 1) % total;
      if (nextIndex === 0) session.round += 1;
      checked++;
    } while (session.combatants[nextIndex].isDefeated && checked < total);

    session.currentTurnIndex = nextIndex;
    await session.save();
    res.json(session);
  } catch (err) {
    next(err);
  }
});

// POST /api/combat-sessions/:id/complete
router.post('/:id/complete', async (req, res, next) => {
  try {
    const session = await CombatSession.findOne({ _id: req.params.id, userId: req.user._id });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    let totalXP = 0;
    for (const c of session.combatants) {
      if (c.type === 'monster' && c.isDefeated && c.monsterId) {
        const monster = await Monster.findById(c.monsterId);
        if (monster) totalXP += monster.xp;
      }
    }

    session.status = 'completed';
    session.totalXPEarned = totalXP;
    session.completedAt = new Date();
    await session.save();
    res.json(session);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
