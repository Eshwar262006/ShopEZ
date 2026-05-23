const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const createdUsers = await User.insertMany([
      { name: 'Admin User', email: 'admin@shopez.com', password: hashedPassword, role: 'admin' },
      { name: 'Tech Seller', email: 'seller@shopez.com', password: hashedPassword, role: 'seller' },
      { name: 'John Doe', email: 'user@shopez.com', password: hashedPassword, role: 'user' }
    ]);

    const sellerId = createdUsers[1]._id;

    // Create products
    const sampleProducts = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Experience pure sound with our premium noise-cancelling headphones. Features 30-hour battery life and ultra-comfortable ear cushions.',
        price: 249.99,
        originalPrice: 299.99,
        discount: 16,
        category: 'Electronics',
        stock: 50,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.8,
        numReviews: 124
      },
      {
        name: 'Smart Fitness Watch Series 5',
        description: 'Track your health, sleep, and workouts with precision. Water-resistant up to 50m with a vibrant OLED display.',
        price: 199.50,
        originalPrice: 199.50,
        discount: 0,
        category: 'Electronics',
        stock: 30,
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.6,
        numReviews: 89
      },
      {
        name: 'Minimalist Leather Backpack',
        description: 'Handcrafted genuine leather backpack. Perfect for daily commute, fits up to a 15-inch laptop.',
        price: 120.00,
        originalPrice: 150.00,
        discount: 20,
        category: 'Fashion',
        stock: 15,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.9,
        numReviews: 42
      },
      {
        name: 'Mechanical Gaming Keyboard',
        description: 'RGB backlit mechanical keyboard with tactile blue switches. Designed for pro gamers and typists.',
        price: 89.99,
        originalPrice: 110.00,
        discount: 18,
        category: 'Electronics',
        stock: 100,
        images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.7,
        numReviews: 215
      },
      {
        name: 'Professional DSLR Camera',
        description: 'Capture stunning photos and 4K video. Includes a versatile 24-70mm lens kit.',
        price: 1299.99,
        originalPrice: 1499.99,
        discount: 13,
        category: 'Electronics',
        stock: 5,
        images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.9,
        numReviews: 67
      },
      {
        name: 'Ceramic Coffee Mug Set',
        description: 'Set of 4 artisan ceramic mugs. Microwave and dishwasher safe. Perfect for your morning brew.',
        price: 34.99,
        originalPrice: 34.99,
        discount: 0,
        category: 'Home & Kitchen',
        stock: 80,
        images: ['https://images.unsplash.com/photo-1514432324607-a2ce7beea89f?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.5,
        numReviews: 38
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Premium mesh back office chair with adjustable lumbar support and 3D armrests.',
        price: 289.00,
        originalPrice: 350.00,
        discount: 17,
        category: 'Home & Kitchen',
        stock: 20,
        images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.4,
        numReviews: 156
      },
      {
        name: 'Polarized Aviator Sunglasses',
        description: 'Classic aviator style with 100% UV protection and polarized lenses to reduce glare.',
        price: 45.00,
        originalPrice: 60.00,
        discount: 25,
        category: 'Fashion',
        stock: 200,
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'],
        seller: sellerId,
        isFeatured: true,
        isActive: true,
        ratings: 4.7,
        numReviews: 312
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
