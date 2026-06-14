const mongoose = require('mongoose');

const uri = "mongodb://Shopze:shopze123@ac-2cdfksi-shard-00-00.pe3wxtg.mongodb.net:27017,ac-2cdfksi-shard-00-01.pe3wxtg.mongodb.net:27017,ac-2cdfksi-shard-00-02.pe3wxtg.mongodb.net:27017/test?ssl=true&replicaSet=atlas-2cdfksi-shard-0&authSource=admin&retryWrites=true&w=majority";

const productSchema = new mongoose.Schema({
  name: String, category: String, images: [String], image: String
}, { strict: false });
const Product = mongoose.model('Product', productSchema);

mongoose.connect(uri)
  .then(async () => {
    console.log("Successfully connected to MongoDB Atlas bypassing SRV!");
    
    console.log("Fetching products with broken images...");
    const products = await Product.find({});
    let count = 0;
    
    for (let p of products) {
      const img = (p.images && p.images[0]) || p.image || '';
      if (img.includes('source.unsplash.com')) {
        const keyword = p.category ? p.category.split(' ')[0].toLowerCase() : 'product';
        const newImg = `https://loremflickr.com/400/400/${keyword}?lock=${Math.floor(Math.random() * 1000)}`;
        p.images = [newImg];
        p.image = newImg;
        await p.save();
        count++;
      }
    }
    
    console.log(`✅ Fixed images for ${count} products.`);
    process.exit(0);
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
