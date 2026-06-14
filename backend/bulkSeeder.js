const mongoose = require('mongoose');
const dotenv = require('dotenv');

// We use the provided MONGO_URI
const MONGO_URI = "mongodb+srv://Shopze:shopze123@cluster0.pe3wxtg.mongodb.net/?appName=Cluster0";

// Schemas
const userSchema = new mongoose.Schema({
  name: String, email: String, role: String
}, { strict: false });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  numReviews: Number,
}, { strict: false });

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);

const categories = ['Electronics', 'Clothing', 'Home', 'Sports', 'Accessories'];
const adjectives = ['Premium', 'Wireless', 'Smart', 'Ergonomic', 'Vintage', 'Eco-Friendly', 'Portable', 'Compact', 'Heavy-Duty', 'Luxury', 'Classic', 'Modern', 'Sleek', 'Ultra-fast', 'Minimalist', 'Handcrafted', 'Next-Gen', 'Professional', 'Pro', 'Essential'];
const nouns = {
  'Electronics': ['Headphones', 'Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Camera', 'Drone', 'Speaker', 'Microphone', 'Router'],
  'Clothing': ['Jacket', 'Sneakers', 'T-Shirt', 'Jeans', 'Sweater', 'Hoodie', 'Socks', 'Cap', 'Scarf', 'Gloves'],
  'Home': ['Plant Pot', 'Desk Lamp', 'Coffee Maker', 'Blender', 'Vacuum', 'Air Purifier', 'Blanket', 'Pillow', 'Rug', 'Mirror'],
  'Sports': ['Yoga Mat', 'Dumbbells', 'Treadmill', 'Tennis Racket', 'Basketball', 'Soccer Ball', 'Water Bottle', 'Jump Rope', 'Resistance Bands'],
  'Accessories': ['Watch', 'Backpack', 'Sunglasses', 'Wallet', 'Belt', 'Necklace', 'Bracelet', 'Ring', 'Earrings']
};

const generateProducts = (sellerId, count) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const nounList = nouns[category];
    const noun = nounList[Math.floor(Math.random() * nounList.length)];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    
    const name = `${adjective} ${noun} ${i}`;
    const price = Math.floor(Math.random() * 500) + 10 + 0.99;
    const stock = Math.floor(Math.random() * 100) + 10;
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    const numReviews = Math.floor(Math.random() * 500);
    
    // Unsplash placeholders
    const imageKeywords = category.toLowerCase();
    const image = `https://source.unsplash.com/400x400/?${imageKeywords}&sig=${i}`;

    products.push({
      name,
      description: `Experience the best in class with our ${name}. Designed for durability, performance, and everyday use. Perfect for any lifestyle.`,
      price,
      category,
      image,
      stock,
      seller: sellerId,
      rating: parseFloat(rating),
      numReviews
    });
  }
  return products;
};

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas!");

    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log("No seller found. Creating a default bulk seller...");
      seller = await User.create({
        name: 'Bulk Seller',
        email: 'bulkseller@shopez.com',
        role: 'seller'
      });
    }

    console.log(`Using Seller ID: ${seller._id}`);

    console.log("Generating 600 products...");
    const products = generateProducts(seller._id, 600);

    console.log("Inserting products into the database...");
    await Product.insertMany(products);

    console.log("✅ Successfully inserted 600 products!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error inserting products:", error);
    process.exit(1);
  }
};

run();
