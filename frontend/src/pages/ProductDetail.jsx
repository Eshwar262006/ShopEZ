import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, revRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/reviews/${id}`)
        ]);
        setProduct(prodRes.data);
        setReviews(revRes.data);
      } catch (err) { console.error(err); navigate('/products'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    await addToCart(product._id, qty);
    alert('Added to cart!');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) return alert('Please select a rating');
    setReviewLoading(true);
    try {
      await api.post(`/reviews/${id}`, { rating, comment });
      alert('Review submitted');
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally { setReviewLoading(false); }
  };

  if (loading) return <div className="loader-center"><div className="spinner"></div></div>;
  if (!product) return null;

  return (
    <div className="container section fade-in">
      <div className="product-detail-layout card">
        <div className="product-gallery">
          <div className="main-image">
            {product.discount > 0 && <div className="product-badge">-{product.discount}%</div>}
            <img src={(product.images[activeImg] && product.images[activeImg].includes('unsplash')) ? `https://loremflickr.com/600/600/${product.category.split(' ')[0].toLowerCase()}?lock=${product._id.substring(18)}` : (product.images[activeImg] || 'https://via.placeholder.com/600')} alt={product.name} />
          </div>
          <div className="thumbnail-list">
            {product.images.map((img, i) => (
              <div key={i} className={`thumbnail ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                <img src={(img && img.includes('unsplash')) ? `https://loremflickr.com/100/100/${product.category.split(' ')[0].toLowerCase()}?lock=${product._id.substring(18)}` : (img || 'https://via.placeholder.com/100')} alt={`Thumbnail ${i}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="product-info-panel">
          <div className="breadcrumbs">Products / {product.category}</div>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-meta">
            <StarRating value={product.ratings} />
            <span>{product.numReviews} Reviews</span>
            <span className="dot">•</span>
            <span>Brand: <strong>{product.brand || 'Generic'}</strong></span>
          </div>
          
          <div className="detail-price-box">
            <div className="prices">
              <span className="current">₹{product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="old">₹{product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </div>
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="action-box">
            <div className="qty-selector">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
              <input type="number" readOnly value={qty} />
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button 
              className="btn btn-primary btn-lg flex-1" 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >🛒 Add to Cart</button>
          </div>
        </div>
      </div>

      <div className="reviews-section card" style={{marginTop: 40}}>
        <h2>Customer Reviews</h2>
        <div className="divider"></div>
        
        <div className="grid-2" style={{gap: 40}}>
          <div className="reviews-list">
            {reviews.length === 0 ? <p className="text-muted">No reviews yet.</p> : (
              reviews.map(rev => (
                <div key={rev._id} className="review-item border-bottom" style={{marginBottom: 20, paddingBottom: 20}}>
                  <div className="flex-between" style={{marginBottom: 8}}>
                    <strong>{rev.name}</strong>
                    <span className="text-muted text-sm">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <StarRating value={rev.rating} />
                  <p style={{marginTop: 12}}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>
          
          <div className="review-form-container">
            <h3>Write a Review</h3>
            {user ? (
              <form onSubmit={submitReview} style={{marginTop: 20}}>
                <div className="form-group" style={{marginBottom: 16}}>
                  <label>Rating</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>
                <div className="form-group" style={{marginBottom: 16}}>
                  <label>Comment</label>
                  <textarea className="form-input" rows="4" required value={comment} onChange={e => setComment(e.target.value)}></textarea>
                </div>
                <button type="submit" className="btn btn-secondary" disabled={reviewLoading}>
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="alert alert-error" style={{marginTop: 20}}>
                Please <Link to="/login" style={{textDecoration: 'underline'}}>login</Link> to write a review.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
