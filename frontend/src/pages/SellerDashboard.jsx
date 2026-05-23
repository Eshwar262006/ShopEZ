import { useState, useEffect } from 'react';
import api from '../utils/api';
import './Dashboard.css';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', originalPrice: '', discount: '', 
    category: 'Electronics', brand: '', stock: '', images: ''
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products/my');
      setProducts(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleOpenModal = (prod = null) => {
    if (prod) {
      setEditId(prod._id);
      setFormData({
        name: prod.name, description: prod.description, price: prod.price,
        originalPrice: prod.originalPrice || '', discount: prod.discount || '',
        category: prod.category, brand: prod.brand || '', stock: prod.stock,
        images: prod.images.join(', ')
      });
    } else {
      setEditId(null);
      setFormData({
        name: '', description: '', price: '', originalPrice: '', discount: '', 
        category: 'Electronics', brand: '', stock: '', images: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      discount: Number(formData.discount),
      stock: Number(formData.stock),
      images: formData.images.split(',').map(s => s.trim()).filter(s => s)
    };
    
    try {
      if (editId) await api.put(`/products/${editId}`, payload);
      else await api.post('/products', payload);
      setShowModal(false);
      fetchProducts();
    } catch (err) { alert(err.response?.data?.message || 'Error saving product'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) { alert('Error deleting'); }
  };

  if (loading) return <div className="loader-center"><div className="spinner"></div></div>;

  return (
    <div className="container section fade-in dashboard">
      <div className="flex-between" style={{marginBottom: 40}}>
        <h1>Seller <span className="gradient-text">Dashboard</span></h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Product</button>
      </div>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id}>
                  <td>
                    <div className="flex" style={{gap: 12}}>
                      <img src={prod.images[0]} style={{width: 40, height: 40, objectFit: 'cover', borderRadius: 4}} />
                      <div style={{fontWeight: 600}}>{prod.name.substring(0,30)}...</div>
                    </div>
                  </td>
                  <td>{prod.category}</td>
                  <td>₹{prod.price.toFixed(2)}</td>
                  <td>{prod.stock}</td>
                  <td>
                    {prod.isActive ? <span className="badge badge-success">Active</span> : <span className="badge badge-danger">Deleted</span>}
                  </td>
                  <td>
                    <div className="flex" style={{gap: 8}}>
                      <button onClick={() => handleOpenModal(prod)} className="btn btn-secondary btn-sm">Edit</button>
                      <button onClick={() => handleDelete(prod._id)} className="btn btn-sm" style={{background: 'var(--danger)', color: '#fff'}}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="6" style={{textAlign: 'center', padding: 40}}>No products yet. Add your first one!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
          <div className="card" style={{width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto'}}>
            <div className="flex-between" style={{marginBottom: 20}}>
              <h2>{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--text)'}}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="grid-2">
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Name</label>
                <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Description</label>
                <textarea required className="form-input" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input required type="number" step="0.01" className="form-input" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Original Price</label>
                <input type="number" step="0.01" className="form-input" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Discount %</label>
                <input type="number" className="form-input" value={formData.discount} onChange={e => setFormData({...formData, discount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Stock</label>
                <input required type="number" className="form-input" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-input form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {['Electronics', 'Fashion', 'Home & Kitchen', 'Books', 'Sports', 'Beauty', 'Toys', 'Groceries', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input className="form-input" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
              </div>
              <div className="form-group" style={{gridColumn: '1 / -1'}}>
                <label className="form-label">Image URLs (comma separated)</label>
                <input required className="form-input" value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} />
              </div>
              <div style={{gridColumn: '1 / -1', marginTop: 16}}>
                <button type="submit" className="btn btn-primary btn-full btn-lg">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
