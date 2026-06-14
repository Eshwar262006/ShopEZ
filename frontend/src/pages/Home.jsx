import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Home.css';
import StarRating from '../components/StarRating';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/products/featured');
        if (data.length === 0) {
          // fallback if no featured products just get latest
          const fallback = await api.get('/products?limit=8');
          setFeatured(fallback.data.products);
        } else {
          setFeatured(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page fade-in">
      <section className="hero-section">
        <div className="hero-bg">
          <div className="blob"></div>
          <div className="blob blob-2"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Discover the Future of <span className="gradient-text">Shopping</span>
          </h1>
          <p className="hero-subtitle">
            Experience an effortless online marketplace with curated collections, unbeatable discounts, and next-gen seamless checkout.
          </p>
          <div className="hero-btns">
            <Link to="/products" className="btn btn-primary btn-lg">Explore Catalog ✨</Link>
          </div>
          
          <div className="hero-stats">
            <div className="stat"><h3>10K+</h3><p>Products</p></div>
            <div className="stat divider-stat"></div>
            <div className="stat"><h3>5K+</h3><p>Happy Users</p></div>
            <div className="stat divider-stat"></div>
            <div className="stat"><h3>24/7</h3><p>Support</p></div>
          </div>
        </div>
      </section>

      <section className="featured-section section">
        <div className="container">
          <div className="section-header">
            <h2>Trending Now ⚡</h2>
            <Link to="/products" className="view-all">View All Products <span>→</span></Link>
          </div>

          {loading ? (
            <div className="loader-center"><div className="spinner"></div></div>
          ) : (
            <div className="grid-4 products-grid">
              {featured.map(product => (
                <Link to={`/product/${product._id}`} key={product._id} className="card product-card">
                  {product.discount > 0 && <div className="product-badge">-{product.discount}%</div>}
                  <div className="product-img-wrapper">
                    <img src={(product.images[0] && product.images[0].includes('unsplash')) ? `https://loremflickr.com/400/400/${product.category.split(' ')[0].toLowerCase()}?lock=${product._id.substring(18)}` : (product.images[0] || 'https://via.placeholder.com/400x400?text=No+Image')} alt={product.name} />
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
              {featured.length === 0 && <p className="text-muted">No products available at the moment. Add some as admin/seller!</p>}
            </div>
          )}
        </div>
      </section>

      <section className="benefits-section section">
        <div className="container">
          <div className="grid-3 benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On all orders over ₹50. Track your package in real time.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Secure Checkout</h3>
              <p>Bank-grade encryption applied to every transaction.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">↩️</div>
              <h3>Easy Returns</h3>
              <p>Not satisfied? Return it within 30 days hassle-free.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
