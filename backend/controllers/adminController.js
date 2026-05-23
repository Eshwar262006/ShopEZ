const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc  Admin dashboard stats
// @route GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.find().select('totalPrice status'),
    ]);
    const revenue = orders.filter(o => o.status !== 'Cancelled').reduce((acc, o) => acc + o.totalPrice, 0);
    const statusBreakdown = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {});
    res.json({ totalUsers, totalProducts, totalOrders, revenue, statusBreakdown });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Update user role / status
// @route PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.role = req.body.role || user.role;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
    await user.save();
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get all orders (admin)
// @route GET /api/admin/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Update order status
// @route PUT /api/admin/orders/:id
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status || order.status;
    if (req.body.status === 'Delivered') { order.isDelivered = true; order.deliveredAt = Date.now(); }
    await order.save();
    res.json(order);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Get all products (admin)
// @route GET /api/admin/products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('seller', 'name email').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getStats, getAllUsers, updateUser, getAllOrders, updateOrderStatus, getAllProducts };
