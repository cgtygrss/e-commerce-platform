import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { cartItems } = cart;
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
       navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
       setShowSearch(false);
       setSearchQuery('');
    }
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="logo">
          Selené
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        {/* Icons */}
        <div className="nav-icons flex items-center">
             {showSearch ? (
                <form onSubmit={handleSearch} className="search-form" style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        style={{ padding: '0.4rem', border: '1px solid #ddd', marginRight: '0.5rem' }}
                    />
                    <button type="button" onClick={() => setShowSearch(false)}><X size={18} /></button>
                </form>
            ) : (
                <button className="icon-btn" onClick={() => setShowSearch(true)}><Search size={20} /></button>
            )}

          {user ? (
            <div className="user-menu" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem' }}>{user.name.split(' ')[0]}</span>
              <button onClick={logout} className="icon-btn" title="Logout">
                <User size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" title="Login">
              <User size={20} />
            </Link>
          )}

          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingBag size={20} />
            {cartItems.length > 0 && <span className="cart-count">{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>}
          </Link>
          <button className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/shop" onClick={() => setIsOpen(false)}>Shop</Link>
        <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        {user ? (
          <button onClick={() => { logout(); setIsOpen(false); }}>Logout</button>
        ) : (
          <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
        )}
      </div>

      <style>{`
        .navbar {
          padding: 1.5rem 0;
          background-color: var(--color-bg);
          position: sticky;
          top: 0;
          z-index: 100;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }
        .logo {
          font-family: var(--font-heading);
          font-size: 2rem;
          color: var(--color-gold);
          letter-spacing: 2px;
        }
        .desktop-menu {
          display: none;
          gap: 3rem;
        }
        .nav-link {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
        }
        .nav-link:hover {
          color: var(--color-gold);
        }
        .nav-icons {
          gap: 1.5rem;
        }
        .icon-btn {
          color: var(--color-text);
          transition: color 0.2s;
        }
        .icon-btn:hover {
          color: var(--color-gold);
        }
        .cart-btn {
          position: relative;
        }
        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: var(--color-gold);
          color: var(--color-text-dark);
          font-size: 0.7rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }
        .mobile-toggle {
          display: block;
          color: var(--color-text);
        }
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: var(--color-surface);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 99;
        }
        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .mobile-menu a {
          font-size: 1.2rem;
          color: var(--color-text);
          text-align: center;
        }
        
        @media (min-width: 768px) {
          .desktop-menu {
            display: flex;
          }
          .mobile-toggle {
            display: none;
          }
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
