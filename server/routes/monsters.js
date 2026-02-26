const router = require('express').Router();
const Monster = require('../models/Monster');

// GET /api/monsters?search=goblin
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }
    const monsters = await Monster.find(filter).sort({ level: 1, name: 1 });
    res.json(monsters);
  } catch (err) {
    next(err);
  }
});

// GET /api/monsters/:id
router.get('/:id', async (req, res, next) => {
  try {
    const monster = await Monster.findById(req.params.id);
    if (!monster) return res.status(404).json({ message: 'Monster not found' });
    res.json(monster);
  } catch (err) {
    next(err);
  }
});

// POST /api/monsters
router.post('/', async (req, res, next) => {
  try {
    const monster = await Monster.create(req.body);
    res.status(201).json(monster);
  } catch (err) {
    next(err);
  }
});

// PUT /api/monsters/:id
router.put('/:id', async (req, res, next) => {
  try {
    const monster = await Monster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!monster) return res.status(404).json({ message: 'Monster not found' });
    res.json(monster);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/monsters/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const monster = await Monster.findByIdAndDelete(req.params.id);
    if (!monster) return res.status(404).json({ message: 'Monster not found' });
    res.json({ message: 'Monster deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
