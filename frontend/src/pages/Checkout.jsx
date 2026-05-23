import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'India',
  });
  
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  
  const itemsPrice = cartTotal;
  const shippingPrice = itemsPrice > 50 ? 0 : 10;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.items.length === 0) return alert('Your cart is empty');
    
    setLoading(true);
    try {
      const orderData = {
        items: cart.items.map(i => ({
          product: i.product._id,
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          quantity: i.quantity
        })),
        shippingAddress: shipping,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };
      
      const { data } = await api.post('/orders', orderData);
      await clearCart();
      navigate('/orders');
      alert('Order placed successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error placing order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section fade-in cart-page">
      <h1 style={{marginBottom: 32}}>Checkout Flow</h1>
      
      <div className="cart-layout">
        <form onSubmit={handlePlaceOrder} className="card" style={{padding: 32}}>
          <h2 style={{marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)'}}>1. Shipping Address</h2>
          <div className="grid-2" style={{marginBottom: 32}}>
            <div className="form-group" style={{gridColumn: '1 / -1'}}>
              <label className="form-label">Street Address</label>
              <input required type="text" className="form-input" value={shipping.street} onChange={e => setShipping({...shipping, street: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input required type="text" className="form-input" value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input required type="text" className="form-input" value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Zip Code</label>
              <input required type="text" className="form-input" value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Country</label>
              <input required type="text" className="form-input" value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} />
            </div>
          </div>

          <h2 style={{marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)'}}>2. Payment Method</h2>
          <div className="form-group" style={{marginBottom: 32}}>
            <select className="form-input form-select" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
              <option value="Credit Card">Credit Card (Fake Stripe)</option>
              <option value="PayPal">PayPal (Sandbox)</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || cart.items.length === 0}>
             {loading ? <div className="spinner" style={{width: 24, height: 24, borderWidth: 2}}></div> : `Pay ₹${totalPrice.toFixed(2)}`}
          </button>
        </form>

        <div className="cart-summary card" style={{alignSelf: 'flex-start', position: 'sticky', top: 100}}>
          <h3 style={{marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)'}}>Final Order Review</h3>
          
          <div style={{maxHeight: 300, overflowY: 'auto', marginBottom: 20}}>
            {cart.items.map(item => (
              <div key={item.product._id} className="flex-between" style={{marginBottom: 12, borderBottom: '1px solid var(--border)', paddingBottom: 12}}>
                <div className="flex" style={{gap: 12}}>
                  <img src={item.product.images[0]} style={{width: 40, height: 40, borderRadius: 4, objectFit: 'cover'}} />
                  <div>
                    <div style={{fontSize: 14, fontWeight: 600}}>{item.product.name.substring(0, 20)}...</div>
                    <div style={{fontSize: 12, color: 'var(--text-muted)'}}>Qty: {item.quantity}</div>
                  </div>
                </div>
                <div style={{fontWeight: 600}}>₹{(item.product.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="summary-row flex-between" style={{marginBottom: 12, color: 'var(--text-muted)'}}>
            <span>Items Total</span>
            <span>₹{itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row flex-between" style={{marginBottom: 12, color: 'var(--text-muted)'}}>
            <span>Shipping</span>
            <span>{shippingPrice === 0 ? <span className="text-success">Free</span> : `₹${shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="summary-row flex-between" style={{marginBottom: 12, color: 'var(--text-muted)'}}>
            <span>Tax (5%)</span>
            <span>₹{taxPrice.toFixed(2)}</span>
          </div>
          
          <div className="summary-total flex-between" style={{marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 20, fontWeight: 800}}>
            <span>Total to Pay</span>
            <span style={{color: 'var(--accent)'}}>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
