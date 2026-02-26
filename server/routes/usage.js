const router = require('express').Router();
const auth = require('../middleware/auth');
const Monster = require('../models/Monster');
const Encounter = require('../models/Encounter');
const CombatSession = require('../models/CombatSession');
const { LIMITS } = require('../middleware/checkLimit');

// GET /api/usage — returns current counts and tier limits
router.get('/', auth, async (req, res, next) => {
  try {
    const tier = req.user.tier || 'free';
    const [monsters, encounters, combatSessions] = await Promise.all([
      Monster.countDocuments({ userId: req.user._id }),
      Encounter.countDocuments({ userId: req.user._id }),
      CombatSession.countDocuments({ userId: req.user._id, status: 'active' }),
    ]);
    res.json({
      tier,
      usage: { monsters, encounters, combatSessions },
      limits: LIMITS[tier],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
