const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc  Create order
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'No order items' });

    // Decrease stock
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id, items, shippingAddress,
      paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice,
    });

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get logged-in user's orders
// @route GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images');
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name images price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Cancel order
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ message: 'Cannot cancel this order' });
    order.status = 'Cancelled';
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder };
