const Monster = require('../models/Monster');
const Encounter = require('../models/Encounter');
const CombatSession = require('../models/CombatSession');

const LIMITS = {
  free:   { monsters: 20, encounters: 10, combatSessions: 5 },
  patron: { monsters: 40, encounters: 20, combatSessions: 10 },
};

function checkLimit(resourceType) {
  return async (req, res, next) => {
    try {
      const tier = req.user.tier || 'free';
      const limit = LIMITS[tier][resourceType];

      let count;
      switch (resourceType) {
        case 'monsters':
          count = await Monster.countDocuments({ userId: req.user._id });
          break;
        case 'encounters':
          count = await Encounter.countDocuments({ userId: req.user._id });
          break;
        case 'combatSessions':
          count = await CombatSession.countDocuments({ userId: req.user._id, status: 'active' });
          break;
      }

      if (count >= limit) {
        return res.status(403).json({
          message: `${tier === 'free' ? 'Free' : 'Patron'} tier limit reached (${limit} ${resourceType}).`,
          limit,
          current: count,
          tier,
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { checkLimit, LIMITS };
