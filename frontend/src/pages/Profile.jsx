import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user.name,
    phone: user.phone || '',
    street: user.address?.street || '',
    city: user.address?.city || '',
    state: user.address?.state || '',
    zip: user.address?.zip || '',
    country: user.address?.country || 'India',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country
        }
      };
      if (formData.password) payload.password = formData.password;
      
      const { data } = await api.put('/auth/profile', payload);
      updateUser(data);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Error updating profile' });
    } finally { setLoading(false); }
  };

  return (
    <div className="container section fade-in">
      <div className="card" style={{maxWidth: 700, margin: '0 auto', padding: 40}}>
        <h1 style={{marginBottom: 8}}>My Profile</h1>
        <p className="text-muted" style={{marginBottom: 32}}>Update your personal information and address</p>
        
        {msg.text && (
          <div className={`alert alert-${msg.type}`} style={{marginBottom: 24}}>
            {msg.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid-2">
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Email Address (Read Only)</label>
            <input type="email" className="form-input" value={user.email} disabled style={{opacity: 0.7}} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          
          <div className="form-group" style={{gridColumn: '1 / -1', marginTop: 16}}>
            <h3 style={{fontSize: 18, borderBottom: '1px solid var(--border)', paddingBottom: 8}}>Default Address</h3>
          </div>
          
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">Street</label>
            <input className="form-input" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">City</label>
            <input className="form-input" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">State</label>
            <input className="form-input" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Zip Code</label>
            <input className="form-input" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <input className="form-input" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
          </div>
          
          <div className="form-group" style={{gridColumn: '1 / -1', marginTop: 16}}>
            <h3 style={{fontSize: 18, borderBottom: '1px solid var(--border)', paddingBottom: 8}}>Security</h3>
          </div>
          
          <div className="form-group" style={{gridColumn: '1 / -1'}}>
            <label className="form-label">New Password (leave blank to keep current)</label>
            <input type="password" placeholder="••••••••" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} minLength="6" />
          </div>
          
          <div style={{gridColumn: '1 / -1', marginTop: 24}}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
