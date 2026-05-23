import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🛍️</span>
          <span className="logo-text">Shop<span className="logo-accent">EZ</span></span>
        </Link>

        {/* Links */}
        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link>
          {user?.role === 'seller' && (
            <Link to="/seller" className={location.pathname === '/seller' ? 'active' : ''}>Seller</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link>
          )}
        </div>

        {/* Right side */}
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/cart" className="cart-btn" id="nav-cart-btn">
                🛒
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              <div className="user-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span className="user-name">{user.name.split(' ')[0]}</span>
                <span className="chevron">▾</span>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>👤 Profile</Link>
                    <Link to="/orders" onClick={() => setDropdownOpen(false)}>📦 My Orders</Link>
                    {user.role === 'seller' && <Link to="/seller" onClick={() => setDropdownOpen(false)}>🏪 Dashboard</Link>}
                    {user.role === 'admin' && <Link to="/admin" onClick={() => setDropdownOpen(false)}>⚙️ Admin</Link>}
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="hamburger-btn">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}
