// routes/searchRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  const query = req.query.q;

  try {
    const products = await Product.find({
      title: { $regex: new RegExp(query, 'i') }
    });

    // ✅ نرجّعهم جوه object
    res.json({ products });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
