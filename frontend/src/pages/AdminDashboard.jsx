import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Dashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/orders')
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data);
    } catch (err) { console.error(err); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}`, { status });
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error'); }
  };

  if (!stats) return <div className="loader-center"><div className="spinner"></div></div>;

  return (
    <div className="container section fade-in dashboard">
      <div className="flex-between" style={{marginBottom: 40}}>
        <h1>Admin <span className="gradient-text">Dashboard</span></h1>
        <div className="dashboard-tabs">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>All Orders</button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid-4" style={{marginBottom: 40}}>
            <div className="card stat-card">
              <div className="stat-icon" style={{background: 'rgba(108,99,255,0.1)', color: 'var(--primary)'}}>👥</div>
              <div className="stat-info">
                <h3>Total Users</h3>
                <div className="stat-val">{stats.totalUsers}</div>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{background: 'rgba(67,233,123,0.1)', color: 'var(--success)'}}>🛒</div>
              <div className="stat-info">
                <h3>Total Products</h3>
                <div className="stat-val">{stats.totalProducts}</div>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{background: 'rgba(247,151,30,0.1)', color: 'var(--warning)'}}>📦</div>
              <div className="stat-info">
                <h3>Total Orders</h3>
                <div className="stat-val">{stats.totalOrders}</div>
              </div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon" style={{background: 'rgba(255,77,109,0.1)', color: 'var(--danger)'}}>💰</div>
              <div className="stat-info">
                <h3>Revenue</h3>
                <div className="stat-val">₹{stats.revenue.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 style={{marginBottom: 20}}>Order Status Breakdown</h3>
            <div style={{display: 'flex', gap: 20, flexWrap: 'wrap'}}>
              {Object.entries(stats.statusBreakdown).map(([status, count]) => (
                <div key={status} style={{padding: '16px 24px', background: 'var(--bg3)', borderRadius: 8, border: '1px solid var(--border)'}}>
                  <div style={{fontSize: 14, color: 'var(--text-muted)'}}>{status}</div>
                  <div style={{fontSize: 24, fontWeight: 800}}>{count}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="card" style={{padding: 0, overflow: 'hidden'}}>
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.substring(18)}</td>
                    <td>{order.user.name}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>₹{order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="form-input form-select" style={{padding: '6px 12px', fontSize: 13, height: 'auto'}}
                        value={order.status}
                        onChange={e => updateOrderStatus(order._id, e.target.value)}
                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
