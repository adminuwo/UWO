const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const ReferralLink = require('../models/ReferralLink');
const ClickLog = require('../models/ClickLog');
const { protect } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all active products/projects
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/products
// @desc    Add a project/product to MongoDB (at least 1 URL required)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, webUrl, androidUrl, iosUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const cleanWeb = webUrl ? webUrl.trim() : '';
    const cleanAndroid = androidUrl ? androidUrl.trim() : '';
    const cleanIos = iosUrl ? iosUrl.trim() : '';

    if (!cleanWeb && !cleanAndroid && !cleanIos) {
      return res.status(400).json({
        error: 'At least one URL (Web, Android Play Store, or iOS App Store) is required.',
      });
    }

    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newProduct = await Product.create({
      name: name.trim(),
      slug,
      description: description ? description.trim() : '',
      webUrl: cleanWeb,
      androidUrl: cleanAndroid,
      iosUrl: cleanIos,
      active: true,
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Edit an existing project/product
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, webUrl, androidUrl, iosUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const cleanWeb = webUrl !== undefined ? webUrl.trim() : undefined;
    const cleanAndroid = androidUrl !== undefined ? androidUrl.trim() : undefined;
    const cleanIos = iosUrl !== undefined ? iosUrl.trim() : undefined;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const finalWeb = cleanWeb !== undefined ? cleanWeb : product.webUrl;
    const finalAndroid = cleanAndroid !== undefined ? cleanAndroid : product.androidUrl;
    const finalIos = cleanIos !== undefined ? cleanIos : product.iosUrl;

    if (!finalWeb && !finalAndroid && !finalIos) {
      return res.status(400).json({
        error: 'At least one URL (Web, Android Play Store, or iOS App Store) must remain configured.',
      });
    }

    product.name = name.trim();
    if (description !== undefined) product.description = description.trim();
    if (cleanWeb !== undefined) product.webUrl = cleanWeb;
    if (cleanAndroid !== undefined) product.androidUrl = cleanAndroid;
    if (cleanIos !== undefined) product.iosUrl = cleanIos;

    await product.save();

    res.json({ success: true, message: 'Project updated successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a project/product and associated links
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete associated referral links and click logs
    await ReferralLink.deleteMany({ product: id });
    await ClickLog.deleteMany({ product: id });
    await Product.findByIdAndDelete(id);

    res.json({ success: true, message: `Project "${product.name}" and associated links deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
