const router = require('express').Router();
const Encounter = require('../models/Encounter');

// GET /api/encounters
router.get('/', async (req, res, next) => {
  try {
    const encounters = await Encounter.find().sort({ createdAt: -1 });
    res.json(encounters);
  } catch (err) {
    next(err);
  }
});

// GET /api/encounters/:id (populated with monster data)
router.get('/:id', async (req, res, next) => {
  try {
    const encounter = await Encounter.findById(req.params.id)
      .populate('monsters.monsterId');
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });
    res.json(encounter);
  } catch (err) {
    next(err);
  }
});

// POST /api/encounters
router.post('/', async (req, res, next) => {
  try {
    const encounter = await Encounter.create(req.body);
    res.status(201).json(encounter);
  } catch (err) {
    next(err);
  }
});

// PUT /api/encounters/:id
router.put('/:id', async (req, res, next) => {
  try {
    const encounter = await Encounter.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });
    res.json(encounter);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/encounters/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const encounter = await Encounter.findByIdAndDelete(req.params.id);
    if (!encounter) return res.status(404).json({ message: 'Encounter not found' });
    res.json({ message: 'Encounter deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
