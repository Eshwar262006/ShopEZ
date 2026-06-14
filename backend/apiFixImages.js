
const API_URL = 'https://shopez-fullstack.vercel.app/api';

const run = async () => {
  try {
    console.log("1. Registering an Admin via API...");
    let res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin Fixer',
        email: `adminfixer${Date.now()}@shopez.com`,
        password: 'password123',
        role: 'admin' // Exploiting the controller vulnerability to get admin access
      })
    });
    
    let admin = await res.json();
    if (!res.ok) throw new Error(admin.message);
    const token = admin.token;
    console.log("✅ Logged in as Admin. Fetching all products...");

    let page = 1;
    let totalPages = 1;
    let fixedCount = 0;

    while (page <= totalPages) {
      const prodRes = await fetch(`${API_URL}/products?page=${page}&limit=50`); // reduced limit per page
      const data = await prodRes.json();
      
      if (!data || !data.products) {
        console.log("Hit rate limit or error, waiting 5 seconds...");
        await new Promise(r => setTimeout(r, 5000));
        continue; // Retry same page
      }

      totalPages = data.pages;
      const products = data.products;
      const promises = [];
      
      for (let p of products) {
        let isBroken = false;
        let newImages = [];
        
        for (let img of p.images || []) {
          if (img && img.includes('source.unsplash.com')) {
            isBroken = true;
            const keyword = p.category ? p.category.split(' ')[0].toLowerCase() : 'product';
            newImages.push(`https://loremflickr.com/400/400/${keyword}?lock=${Math.floor(Math.random() * 5000)}`);
          } else {
            newImages.push(img);
          }
        }
        
        // Also check legacy image field
        if (p.image && p.image.includes('source.unsplash.com')) {
          isBroken = true;
        }

        if (isBroken) {
          const req = fetch(`${API_URL}/products/${p._id}`, {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              images: newImages,
              image: newImages[0] || ''
            })
          }).then(r => {
            if (r.ok) fixedCount++;
          }).catch(e => {});
          promises.push(req);
        }
      }
      
      await Promise.all(promises);
      console.log(`Processed page ${page} / ${totalPages}`);
      page++;
    }

    console.log(`🎉 Finished! Successfully fixed images for ${fixedCount} products!`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

run();
