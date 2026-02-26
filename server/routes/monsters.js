const router = require('express').Router();
const auth = require('../middleware/auth');
const { checkLimit } = require('../middleware/checkLimit');
const Monster = require('../models/Monster');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

router.use(auth);

// GET /api/monsters?search=goblin — returns global seeds + user's own
router.get('/', async (req, res, next) => {
  try {
    const filter = {
      $or: [{ userId: null }, { userId: req.user._id }],
    };
    if (req.query.search) {
      filter.name = { $regex: escapeRegex(req.query.search), $options: 'i' };
    }
    const monsters = await Monster.find(filter).sort({ level: 1, name: 1 });
    res.json(monsters);
  } catch (err) {
    next(err);
  }
});

// GET /api/monsters/:id — only global or user's own
router.get('/:id', async (req, res, next) => {
  try {
    const monster = await Monster.findById(req.params.id);
    if (!monster) return res.status(404).json({ message: 'Monster not found' });
    if (monster.userId && monster.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(monster);
  } catch (err) {
    next(err);
  }
});

// POST /api/monsters — always assigns userId
router.post('/', checkLimit('monsters'), async (req, res, next) => {
  try {
    const monster = await Monster.create({ ...req.body, userId: req.user._id });
    res.status(201).json(monster);
  } catch (err) {
    next(err);
  }
});

// PUT /api/monsters/:id — only user's own (not global seeds)
router.put('/:id', async (req, res, next) => {
  try {
    const monster = await Monster.findOne({ _id: req.params.id, userId: req.user._id });
    if (!monster) return res.status(404).json({ message: 'Monster not found or not yours' });
    Object.assign(monster, req.body);
    monster.userId = req.user._id; // prevent overwrite
    await monster.save();
    res.json(monster);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/monsters/:id — only user's own (not global seeds)
router.delete('/:id', async (req, res, next) => {
  try {
    const monster = await Monster.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!monster) return res.status(404).json({ message: 'Monster not found or not yours' });
    res.json({ message: 'Monster deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
