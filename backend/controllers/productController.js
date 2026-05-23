const Product = require('../models/Product');

// @desc  Get all products (with filter/search/pagination)
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    if (keyword) query.$text = { $search: keyword };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const sortOptions = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { ratings: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort(sortBy).skip(skip).limit(Number(limit)).populate('seller', 'name'),
      Product.countDocuments(query),
    ]);
    res.json({ products, page: Number(page), pages: Math.ceil(total / limit), total });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get featured products
// @route GET /api/products/featured
const getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true }).limit(8).populate('seller', 'name');
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name email');
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Create product (seller)
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user._id });
    res.status(201).json(product);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });
    Object.assign(product, req.body);
    const updated = await product.save();
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });
    product.isActive = false;
    await product.save();
    res.json({ message: 'Product removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get seller's own products
// @route GET /api/products/my
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getProducts, getFeatured, getProductById, createProduct, updateProduct, deleteProduct, getMyProducts };
