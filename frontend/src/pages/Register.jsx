import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(name, email, password, role);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join ShopEZ today</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" required className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" required className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" required className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength="6" />
          </div>
          <div className="form-group">
            <label className="form-label">I want to</label>
            <select className="form-input form-select" value={role} onChange={e => setRole(e.target.value)}>
              <option value="user">Buy Products (User)</option>
              <option value="seller">Sell Products (Seller)</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <div className="spinner" style={{width: 20, height: 20, borderWidth: 2}}></div> : 'Sign Up'}
          </button>
        </form>
        
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
