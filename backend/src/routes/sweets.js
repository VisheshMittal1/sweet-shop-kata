const express = require('express');
const Sweet = require('../models/sweet');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// saare sweets routes protected hain
router.use(authMiddleware);

// DEBUG: test route to check router mount
router.get('/test-route', (req, res) => {
  res.json({ message: 'sweets router working' });
});

// GET /api/sweets - list all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.findAll();
    res.json(sweets);
  } catch (err) {
    console.error('Error fetching sweets:', err);
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
});

// POST /api/sweets - add a new sweet
router.post('/', async (req, res) => {
  try {
    const { name, category, price, quantity, imageUrl } = req.body;

    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sweet = await Sweet.create({
      name,
      category,
      price,
      quantity,
      imageUrl: imageUrl || null
    });

    res.status(201).json(sweet);
  } catch (err) {
    console.error('Error creating sweet:', err);
    res.status(500).json({ error: 'Failed to create sweet' });
  }
});

// PUT /api/sweets/:id - update a sweet
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, quantity, imageUrl } = req.body;

    const existing = await Sweet.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    const updated = await Sweet.updateById(id, {
      name: name ?? existing.name,
      category: category ?? existing.category,
      price: price ?? existing.price,
      quantity: quantity ?? existing.quantity,
      imageUrl: imageUrl ?? existing.imageUrl
    });

    res.json(updated);
  } catch (err) {
    console.error('Error updating sweet:', err);
    res.status(500).json({ error: 'Failed to update sweet' });
  }
});

// DELETE /api/sweets/:id - delete a sweet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await Sweet.findById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    await Sweet.deleteById(id);
    res.json({ message: 'Sweet deleted successfully' });
  } catch (err) {
    console.error('Error deleting sweet:', err);
    res.status(500).json({ error: 'Failed to delete sweet' });
  }
});

// POST /api/sweets/:id/purchase - purchase a sweet (decrease quantity by 1)
router.post('/:id/purchase', async (req, res) => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity <= 0) {
      return res.status(400).json({ error: 'Sweet out of stock' });
    }

    const newQuantity = sweet.quantity - 1;

    const updated = await Sweet.updateById(id, {
      quantity: newQuantity
    });

    res.json({
      message: 'Sweet purchased successfully',
      sweet: updated
    });
  } catch (err) {
    console.error('Error purchasing sweet:', err);
    res.status(500).json({ error: 'Failed to purchase sweet' });
  }
});

// POST /api/sweets/:id/restock - restock a sweet (increase quantity)
router.post('/:id/restock', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body || {};

    const inc = Number(amount) || 1;

    const sweet = await Sweet.findById(id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    const newQuantity = sweet.quantity + inc;

    const updated = await Sweet.updateById(id, {
      quantity: newQuantity
    });

    res.json({
      message: 'Sweet restocked successfully',
      sweet: updated
    });
  } catch (err) {
    console.error('Error restocking sweet:', err);
    res.status(500).json({ error: 'Failed to restock sweet' });
  }
});

module.exports = router;
