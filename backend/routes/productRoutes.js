const router = require('express').Router();
const { getProducts, getFeatured, getProductById, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { seller } = require('../middleware/roles');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/my', protect, seller, getMyProducts);
router.get('/:id', getProductById);
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, seller, updateProduct);
router.delete('/:id', protect, seller, deleteProduct);

module.exports = router;
