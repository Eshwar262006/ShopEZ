const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: {
    type: String,
    required: true,
    enum: ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Groceries', 'Other']
  },
  brand: { type: String, default: '' },
  images: [{ type: String }],
  stock: { type: Number, required: true, default: 0 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ratings: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);
