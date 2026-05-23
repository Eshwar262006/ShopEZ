import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    if(!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${id}/cancel`);
      setOrders(orders.map(o => o._id === id ? {...o, status: 'Cancelled'} : o));
      alert('Order cancelled');
    } catch (err) { alert(err.response?.data?.message || 'Error cancelling order'); }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Delivered': return 'var(--success)';
      case 'Cancelled': return 'var(--danger)';
      case 'Shipped': return 'var(--accent2)';
      default: return 'var(--primary)';
    }
  };

  if (loading) return <div className="loader-center"><div className="spinner"></div></div>;

  return (
    <div className="container section fade-in">
      <h1 style={{marginBottom: 32}}>My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="card text-center" style={{padding: '60px 20px'}}>
          <div style={{fontSize: 60, marginBottom: 20}}>📦</div>
          <h2>No orders yet</h2>
          <p className="text-muted" style={{marginBottom: 24}}>When you place an order, it will appear here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-list" style={{display: 'flex', flexDirection: 'column', gap: 24}}>
          {orders.map(order => (
            <div key={order._id} className="card" style={{padding: 24}}>
              <div className="flex-between border-bottom" style={{marginBottom: 20, paddingBottom: 16}}>
                <div>
                  <div style={{fontSize: 14, color: 'var(--text-muted)'}}>Order #{order._id}</div>
                  <div style={{fontSize: 14, color: 'var(--text-muted)'}}>Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 18, fontWeight: 800, color: 'var(--accent)'}}>₹{order.totalPrice.toFixed(2)}</div>
                  <div style={{display: 'inline-flex', padding: '4px 10px', borderRadius: 99, fontSize: 12, fontWeight: 700, backgroundColor: `${getStatusColor(order.status)}20`, color: getStatusColor(order.status), marginTop: 8}}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="order-items" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16}}>
                {order.items.map(item => (
                  <div key={item._id} className="flex" style={{gap: 16, background: 'var(--bg3)', padding: 12, borderRadius: 8}}>
                    <Link to={`/product/${item.product._id}`} style={{width: 60, height: 60, borderRadius: 6, overflow: 'hidden', flexShrink: 0}}>
                      <img src={item.image} alt={item.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    </Link>
                    <div>
                      <div style={{fontWeight: 600, fontSize: 14}}><Link to={`/product/${item.product._id}`}>{item.name}</Link></div>
                      <div style={{color: 'var(--text-muted)', fontSize: 13}}>Qty: {item.quantity} • ₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {order.status === 'Pending' && (
                <div style={{marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', textAlign: 'right'}}>
                  <button onClick={() => cancelOrder(order._id)} className="btn btn-secondary btn-sm" style={{color: 'var(--danger)', borderColor: 'var(--danger)'}}>Cancel Order</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
