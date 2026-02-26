const router = require('express').Router();
const auth = require('../middleware/auth');
const { checkLimit } = require('../middleware/checkLimit');
const Encounter = require('../models/Encounter');

router.use(auth);

// GET /api/encounters
router.get('/', async (req, res, next) => {
  try {
    const encounters = await Encounter.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(encounters);
  } catch (err) {
    next(err);
  }
});

// GET /api/encounters/:id (populated with monster data)
router.get('/:id', async (req, res, next) => {
  try {
    const encounter = await Encounter.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('monsters.monsterId');
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });
    res.json(encounter);
  } catch (err) {
    next(err);
  }
});

// POST /api/encounters
router.post('/', checkLimit('encounters'), async (req, res, next) => {
  try {
    const encounter = await Encounter.create({ ...req.body, userId: req.user._id });
    res.status(201).json(encounter);
  } catch (err) {
    next(err);
  }
});

// PUT /api/encounters/:id
router.put('/:id', async (req, res, next) => {
  try {
    const encounter = await Encounter.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });
    res.json(encounter);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/encounters/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const encounter = await Encounter.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });
    res.json({ message: 'Encounter deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
