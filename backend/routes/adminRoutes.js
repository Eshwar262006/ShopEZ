const router = require('express').Router();
const { getStats, getAllUsers, updateUser, getAllOrders, updateOrderStatus, getAllProducts } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/roles');

router.get('/stats', protect, admin, getStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, updateUser);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrderStatus);
router.get('/products', protect, admin, getAllProducts);

module.exports = router;
