import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export default function Cart() {
  const { cart, cartTotal, updateItem, removeItem, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container section fade-in text-center" style={{padding: '120px 20px'}}>
        <div style={{fontSize: 80, marginBottom: 20}}>🛒</div>
        <h2>Your cart is empty</h2>
        <p className="text-muted" style={{marginBottom: 32}}>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container section fade-in cart-page">
      <h1 style={{marginBottom: 32}}>Shopping Cart</h1>
      
      <div className="cart-layout">
        <div className="cart-items card">
          <div className="flex-between border-bottom" style={{paddingBottom: 16, marginBottom: 16}}>
            <h3>Items ({cart.items.length})</h3>
            <button onClick={clearCart} className="btn btn-secondary btn-sm" style={{color: 'var(--danger)', borderColor: 'var(--danger)'}}>Clear Cart</button>
          </div>
          
          {cart.items.map((item) => (
            <div key={item.product._id} className="cart-item border-bottom" style={{display: 'flex', gap: 20, padding: '20px 0'}}>
              <Link to={`/product/${item.product._id}`} style={{width: 100, height: 100, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: 'var(--bg3)'}}>
                <img src={item.product.images[0]} alt={item.product.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </Link>
              
              <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <Link to={`/product/${item.product._id}`} style={{fontSize: 18, fontWeight: 600, marginBottom: 8}}>{item.product.name}</Link>
                <div style={{color: 'var(--text-muted)', fontSize: 13, marginBottom: 'auto'}}>
                  Stock: {item.product.stock > 0 ? <span className="text-success">In Stock</span> : <span className="text-danger">Out of Stock</span>}
                </div>
                
                <div className="flex-between" style={{marginTop: 16}}>
                  <div className="qty-selector small">
                    <button onClick={() => updateItem(item.product._id, item.quantity - 1)}>-</button>
                    <input type="number" readOnly value={item.quantity} />
                    <button onClick={() => updateItem(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: 18, fontWeight: 700, color: 'var(--accent)'}}>₹{(item.product.price * item.quantity).toFixed(2)}</div>
                    <button onClick={() => removeItem(item.product._id)} className="btn text-danger" style={{padding: 0, fontSize: 13, marginTop: 4, background: 'none'}}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary card" style={{alignSelf: 'flex-start', position: 'sticky', top: 100}}>
          <h3 style={{marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border)'}}>Order Summary</h3>
          
          <div className="summary-row flex-between" style={{marginBottom: 16, color: 'var(--text-muted)'}}>
            <span>Subtotal</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row flex-between" style={{marginBottom: 16, color: 'var(--text-muted)'}}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-row flex-between" style={{marginBottom: 16, color: 'var(--text-muted)'}}>
            <span>Tax</span>
            <span>Calculated at checkout</span>
          </div>
          
          <div className="summary-total flex-between" style={{marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 20, fontWeight: 800}}>
            <span>Total</span>
            <span style={{color: 'var(--accent)'}}>₹{cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn btn-primary btn-full btn-lg" 
            style={{marginTop: 32}}
            onClick={() => {
              if (!user) navigate('/login?redirect=/checkout');
              else navigate('/checkout');
            }}
          >
            Proceed to Checkout 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
