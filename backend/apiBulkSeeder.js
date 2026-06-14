
const API_URL = 'https://shopez-fullstack.vercel.app/api';

const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Groceries'];

const adjectives = ['Premium', 'Wireless', 'Smart', 'Ergonomic', 'Vintage', 'Eco-Friendly', 'Portable', 'Compact', 'Heavy-Duty', 'Luxury', 'Classic', 'Modern', 'Sleek', 'Ultra-fast', 'Minimalist', 'Handcrafted', 'Next-Gen', 'Professional', 'Pro', 'Essential', 'Organic', 'Natural', 'Fresh'];

const nouns = {
  'Electronics': ['Headphones', 'Laptop', 'Smartphone', 'Tablet', 'Monitor', 'Keyboard', 'Mouse', 'Camera', 'Drone', 'Speaker', 'Microphone', 'Router'],
  'Fashion': ['Jacket', 'Sneakers', 'T-Shirt', 'Jeans', 'Sweater', 'Hoodie', 'Socks', 'Cap', 'Scarf', 'Gloves', 'Dress', 'Suit', 'Watch', 'Handbag'],
  'Home & Kitchen': ['Plant Pot', 'Desk Lamp', 'Coffee Maker', 'Blender', 'Vacuum', 'Air Purifier', 'Blanket', 'Pillow', 'Rug', 'Mirror', 'Toaster', 'Microwave', 'Knife Set'],
  'Books': ['Novel', 'Biography', 'Cookbook', 'Comic Book', 'Dictionary', 'Encyclopedia', 'Journal', 'Notebook', 'Planner', 'Textbook', 'Thriller', 'Fantasy Book'],
  'Sports': ['Yoga Mat', 'Dumbbells', 'Treadmill', 'Tennis Racket', 'Basketball', 'Soccer Ball', 'Water Bottle', 'Jump Rope', 'Resistance Bands', 'Boxing Gloves', 'Bicycle'],
  'Beauty': ['Lipstick', 'Foundation', 'Mascara', 'Eyeliner', 'Perfume', 'Lotion', 'Shampoo', 'Conditioner', 'Hair Gel', 'Nail Polish', 'Face Wash', 'Moisturizer'],
  'Toys': ['Action Figure', 'Doll', 'Lego Set', 'Puzzle', 'Board Game', 'Toy Car', 'Teddy Bear', 'Water Gun', 'Kite', 'Yo-Yo', 'Rubiks Cube'],
  'Groceries': ['Apple', 'Banana', 'Bread', 'Milk', 'Eggs', 'Cheese', 'Chicken', 'Beef', 'Rice', 'Pasta', 'Cereal', 'Coffee Beans', 'Tea Bags', 'Chocolate']
};

// Map categories to unsplash search terms
const unsplashTerms = {
  'Electronics': 'technology',
  'Fashion': 'clothing',
  'Home & Kitchen': 'kitchen',
  'Books': 'book',
  'Sports': 'fitness',
  'Beauty': 'makeup',
  'Toys': 'toys',
  'Groceries': 'food'
};

const run = async () => {
  try {
    console.log("1. Registering a temporary Bulk Seller via API...");
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Mega Store 2',
        email: `megastore${Date.now()}@shopez.com`,
        password: 'password123',
        role: 'seller'
      })
    });
    
    let seller = await regRes.json();
    
    if (!regRes.ok) {
      console.log("Registration failed, trying login...", seller);
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'megastore@shopez.com',
          password: 'password123'
        })
      });
      seller = await loginRes.json();
      if (!loginRes.ok) throw new Error(seller.message);
    }

    const token = seller.token;
    console.log(`✅ Logged in as Seller. Token acquired.`);
    console.log("2. Generating and uploading 400 new products (50 for each category)...");

    let successCount = 0;
    const totalProducts = 400; // 8 categories * 50
    const batchSize = 40;
    
    for (let i = 0; i < totalProducts; i += batchSize) {
      const promises = [];
      for (let j = 0; j < batchSize && (i + j) < totalProducts; j++) {
        const id = i + j + 1;
        // Distribute evenly among categories
        const category = categories[(i + j) % categories.length];
        const nounList = nouns[category];
        const noun = nounList[Math.floor(Math.random() * nounList.length)];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        
        const name = `${adjective} ${noun}`;
        const price = Math.floor(Math.random() * 200) + 5 + 0.99;
        const stock = Math.floor(Math.random() * 100) + 10;
        
        // Unsplash placeholders using the mapped terms to ensure relevant images
        const imageKeywords = unsplashTerms[category];
        const image = `https://source.unsplash.com/400x400/?${imageKeywords}&sig=${Date.now() + id}`;

        const req = fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name,
            description: `A top-quality ${noun} for your daily needs. Part of our exclusive ${category} collection. highly rated by customers worldwide.`,
            price,
            category,
            images: [image],
            stock
          })
        }).then(res => {
          if (res.ok) successCount++;
        }).catch(err => {});
        
        promises.push(req);
      }
      
      await Promise.all(promises);
      console.log(`Uploaded batch: ${Math.min(i + batchSize, totalProducts)} / ${totalProducts}`);
    }

    console.log(`🎉 Finished! Successfully added ${successCount} new products spanning all your requested categories!`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

run();
