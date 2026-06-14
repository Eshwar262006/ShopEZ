import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import StarRating from '../components/StarRating';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  
  const categories = ['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Groceries', 'Other'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products?keyword=${keyword}&category=${category}&sort=${sort}&page=${page}`);
        setProducts(data.products);
        setPages(data.pages);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchProducts();
  }, [keyword, category, sort, page]);

  const updateFilters = (key, value) => {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    searchParams.set('page', 1);
    setPage(1);
    navigate(`/products?${searchParams.toString()}`);
  };

  return (
    <div className="container section fade-in products-page">
      <div className="page-header">
        <h1>Explore Products</h1>
        <p>Find what you need from our extensive catalog</p>
      </div>

      <div className="products-layout">
        <aside className="filters-sidebar card">
          <h3>Filters</h3>
          <div className="filter-group">
            <label className="form-label">Search</label>
            <input 
              type="text" className="form-input" placeholder="Search..."
              defaultValue={keyword}
              onKeyDown={e => e.key === 'Enter' && updateFilters('keyword', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label className="form-label">Category</label>
            <div className="category-list">
              <button 
                className={`cat-btn ${category === '' ? 'active' : ''}`}
                onClick={() => updateFilters('category', '')}
              >All Categories</button>
              {categories.map(cat => (
                <button 
                  key={cat} className={`cat-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => updateFilters('category', cat)}
                >{cat}</button>
              ))}
            </div>
          </div>
        </aside>

        <main className="products-main">
          <div className="products-topbar card">
            <p>Showing {products.length} products</p>
            <div className="flex" style={{gap: 12}}>
              <label>Sort by:</label>
              <select className="form-input form-select" value={sort} onChange={e => updateFilters('sort', e.target.value)}>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
             <div className="loader-center"><div className="spinner"></div></div>
          ) : products.length === 0 ? (
            <div className="card text-center" style={{padding: '60px 20px'}}>
              <h2 style={{marginBottom: 16}}>No products found 😢</h2>
              <p className="text-muted">Try adjusting your search or filters</p>
              <button onClick={() => navigate('/products')} className="btn btn-primary" style={{marginTop: 24}}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {products.map(product => (
                  <Link to={`/product/${product._id}`} key={product._id} className="card product-card">
                    {product.discount > 0 && <div className="product-badge">-{product.discount}%</div>}
                    <div className="product-img-wrapper">
                      <img src={(product.images[0] && product.images[0].includes('unsplash')) ? `https://loremflickr.com/400/400/${product.category.split(' ')[0].toLowerCase()}?lock=${product._id.substring(18)}` : (product.images[0] || 'https://via.placeholder.com/400')} alt={product.name} />
                    </div>
                    <div className="product-info">
                      <p className="product-category">{product.category}</p>
                      <h3 className="product-name">{product.name}</h3>
                      <div className="product-meta">
                        <StarRating value={product.ratings} />
                        <span className="review-count">({product.numReviews})</span>
                      </div>
                      <div className="product-price-row">
                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                        {product.originalPrice > product.price && (
                          <span className="product-old-price">₹{product.originalPrice.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {pages > 1 && (
                <div className="pagination">
                  {[...Array(pages).keys()].map(x => (
                    <button 
                      key={x+1} 
                      className={`page-btn ${page === x + 1 ? 'active' : ''}`}
                      onClick={() => setPage(x + 1)}
                    >{x + 1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
