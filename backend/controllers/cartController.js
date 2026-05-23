const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc  Get cart
// @route GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock discount');
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Add to cart
// @route POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingItem = cart.items.find(i => i.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity = Math.min(existingItem.quantity + quantity, product.stock);
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    const populated = await cart.populate('items.product', 'name price images stock discount');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Update cart item quantity
// @route PUT /api/cart/:productId
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    const item = cart.items.find(i => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    const populated = await cart.populate('items.product', 'name price images stock discount');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Remove item from cart
// @route DELETE /api/cart/:productId
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);
    await cart.save();
    const populated = await cart.populate('items.product', 'name price images stock discount');
    res.json(populated);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Clear cart
// @route DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
