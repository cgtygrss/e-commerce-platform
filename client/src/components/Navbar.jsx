import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
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

  // Menu categories with subcategories
  const menuCategories = [
    {
      name: 'Necklaces',
      category: 'necklaces',
      subcategories: [
        { label: 'All Necklaces', link: '/shop?cat=necklaces' },
        { label: 'Pendants', link: '/shop?cat=necklaces&type=pendant' },
        { label: 'Chains', link: '/shop?cat=necklaces&type=chain' },
        { label: 'Lockets', link: '/shop?cat=necklaces&type=locket' },
      ],
      priceRanges: [
        { label: 'Under $200', link: '/shop?cat=necklaces&maxPrice=200' },
        { label: '$200 - $400', link: '/shop?cat=necklaces&minPrice=200&maxPrice=400' },
        { label: '$400 - $600', link: '/shop?cat=necklaces&minPrice=400&maxPrice=600' },
        { label: 'Over $600', link: '/shop?cat=necklaces&minPrice=600' },
      ],
      materials: [
        { label: 'Gold', link: '/shop?cat=necklaces&material=Gold' },
        { label: 'White Gold', link: '/shop?cat=necklaces&material=White Gold' },
        { label: 'Rose Gold', link: '/shop?cat=necklaces&material=Rose Gold' },
        { label: 'Pearl', link: '/shop?cat=necklaces&material=Pearl' },
      ]
    },
    {
      name: 'Earrings',
      category: 'earrings',
      subcategories: [
        { label: 'All Earrings', link: '/shop?cat=earrings' },
        { label: 'Studs', link: '/shop?cat=earrings&type=stud' },
        { label: 'Hoops', link: '/shop?cat=earrings&type=hoop' },
        { label: 'Drop Earrings', link: '/shop?cat=earrings&type=drop' },
      ],
      priceRanges: [
        { label: 'Under $100', link: '/shop?cat=earrings&maxPrice=100' },
        { label: '$100 - $200', link: '/shop?cat=earrings&minPrice=100&maxPrice=200' },
        { label: '$200 - $400', link: '/shop?cat=earrings&minPrice=200&maxPrice=400' },
        { label: 'Over $400', link: '/shop?cat=earrings&minPrice=400' },
      ],
      materials: [
        { label: 'Gold', link: '/shop?cat=earrings&material=Gold' },
        { label: 'Crystal', link: '/shop?cat=earrings&material=Crystal' },
        { label: 'Pearl', link: '/shop?cat=earrings&material=Pearl' },
        { label: 'Emerald', link: '/shop?cat=earrings&material=Emerald' },
      ]
    },
    {
      name: 'Bracelets',
      category: 'bracelets',
      subcategories: [
        { label: 'All Bracelets', link: '/shop?cat=bracelets' },
        { label: 'Chain Bracelets', link: '/shop?cat=bracelets&type=chain' },
        { label: 'Bangles', link: '/shop?cat=bracelets&type=bangle' },
        { label: 'Charm Bracelets', link: '/shop?cat=bracelets&type=charm' },
      ],
      priceRanges: [
        { label: 'Under $150', link: '/shop?cat=bracelets&maxPrice=150' },
        { label: '$150 - $300', link: '/shop?cat=bracelets&minPrice=150&maxPrice=300' },
        { label: '$300 - $600', link: '/shop?cat=bracelets&minPrice=300&maxPrice=600' },
        { label: 'Over $600', link: '/shop?cat=bracelets&minPrice=600' },
      ],
      materials: [
        { label: 'Gold', link: '/shop?cat=bracelets&material=Gold' },
        { label: 'Rose Gold', link: '/shop?cat=bracelets&material=Rose Gold' },
        { label: 'Diamond', link: '/shop?cat=bracelets&material=Diamond' },
        { label: 'Sterling Silver', link: '/shop?cat=bracelets&material=Sterling Silver' },
      ]
    },
    {
      name: 'Rings',
      category: 'rings',
      subcategories: [
        { label: 'All Rings', link: '/shop?cat=rings' },
        { label: 'Engagement Rings', link: '/shop?cat=rings&type=engagement' },
        { label: 'Wedding Bands', link: '/shop?cat=rings&type=wedding' },
        { label: 'Statement Rings', link: '/shop?cat=rings&type=statement' },
      ],
      priceRanges: [
        { label: 'Under $500', link: '/shop?cat=rings&maxPrice=500' },
        { label: '$500 - $1000', link: '/shop?cat=rings&minPrice=500&maxPrice=1000' },
        { label: '$1000 - $2500', link: '/shop?cat=rings&minPrice=1000&maxPrice=2500' },
        { label: 'Over $2500', link: '/shop?cat=rings&minPrice=2500' },
      ],
      materials: [
        { label: 'Gold', link: '/shop?cat=rings&material=Gold' },
        { label: 'Platinum', link: '/shop?cat=rings&material=Platinum' },
        { label: 'Diamond', link: '/shop?cat=rings&material=Diamond' },
        { label: 'Sapphire', link: '/shop?cat=rings&material=Sapphire' },
      ]
    },
  ];

  const handleDropdownEnter = (category) => {
    setActiveDropdown(category);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const handleLinkClick = () => {
    setActiveDropdown(null);
    setIsOpen(false);
    setMobileSubmenu(null);
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="logo">
          Lâl
        </Link>

        {/* Desktop Menu */}
        <div className="desktop-menu">
          <Link to="/" className="nav-link">Home</Link>
          
          {menuCategories.map((cat) => (
            <div 
              key={cat.name}
              className="nav-dropdown-wrapper"
              onMouseEnter={() => handleDropdownEnter(cat.name)}
              onMouseLeave={handleDropdownLeave}
            >
              <Link to={`/shop?cat=${cat.category}`} className="nav-link">
                {cat.name}
              </Link>
              
              {activeDropdown === cat.name && (
                <div className="mega-dropdown">
                  <div className="mega-dropdown-content">
                    <div className="mega-column">
                      <h4>Category</h4>
                      {cat.subcategories.map((sub) => (
                        <Link key={sub.label} to={sub.link} onClick={handleLinkClick}>
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mega-column">
                      <h4>Price</h4>
                      {cat.priceRanges.map((range) => (
                        <Link key={range.label} to={range.link} onClick={handleLinkClick}>
                          {range.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mega-column">
                      <h4>Material</h4>
                      {cat.materials.map((mat) => (
                        <Link key={mat.label} to={mat.link} onClick={handleLinkClick}>
                          {mat.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mega-column mega-featured">
                      <Link to={`/shop?cat=${cat.category}`} onClick={handleLinkClick}>
                        <div className="mega-featured-text">
                          Discover {cat.name}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
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
              <Link to="/profile" className="icon-btn" title="My Profile">
                <User size={20} />
              </Link>
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
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        
        {menuCategories.map((cat) => (
          <div key={cat.name} className="mobile-dropdown">
            <button 
              className="mobile-dropdown-toggle"
              onClick={() => setMobileSubmenu(mobileSubmenu === cat.name ? null : cat.name)}
            >
              {cat.name}
              <ChevronDown className={`chevron ${mobileSubmenu === cat.name ? 'rotate' : ''}`} size={16} />
            </button>
            
            {mobileSubmenu === cat.name && (
              <div className="mobile-submenu">
                <div className="mobile-submenu-section">
                  <span className="mobile-submenu-title">Category</span>
                  {cat.subcategories.map((sub) => (
                    <Link key={sub.label} to={sub.link} onClick={handleLinkClick}>
                      {sub.label}
                    </Link>
                  ))}
                </div>
                <div className="mobile-submenu-section">
                  <span className="mobile-submenu-title">Price</span>
                  {cat.priceRanges.map((range) => (
                    <Link key={range.label} to={range.link} onClick={handleLinkClick}>
                      {range.label}
                    </Link>
                  ))}
                </div>
                <div className="mobile-submenu-section">
                  <span className="mobile-submenu-title">Material</span>
                  {cat.materials.map((mat) => (
                    <Link key={mat.label} to={mat.link} onClick={handleLinkClick}>
                      {mat.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        <Link to="/about" onClick={handleLinkClick}>About</Link>
        <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
        {user ? (
          <>
            <Link to="/profile" onClick={handleLinkClick}>My Profile</Link>
            <button onClick={() => { logout(); handleLinkClick(); }}>Logout</button>
          </>
        ) : (
          <Link to="/login" onClick={handleLinkClick}>Login</Link>
        )}
      </div>

      <style>{`
        .navbar {
          padding: 1rem 0;
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
          gap: 2rem;
          align-items: center;
        }
        
        /* Nav Dropdown Wrapper */
        .nav-dropdown-wrapper {
          position: relative;
        }
        
        .nav-link {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-text-muted);
          position: relative;
          transition: color 0.3s ease;
          padding: 0.5rem 0;
          display: inline-block;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background-color: var(--color-gold);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover {
          color: var(--color-gold);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        
        /* Mega Dropdown */
        .mega-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--color-surface);
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1);
          min-width: 750px;
          padding: 2.5rem 3rem;
          animation: dropdownFade 0.25s ease;
          z-index: 1000;
          border-radius: 4px;
        }
        
        .mega-dropdown::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: transparent;
        }
        
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .mega-dropdown-content {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1.2fr;
          gap: 3rem;
        }
        
        .mega-column h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--color-gold);
          margin-bottom: 1.25rem;
          font-weight: 600;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
        }
        
        .mega-column a {
          display: block;
          font-size: 0.95rem;
          color: var(--color-text-muted);
          padding: 0.6rem 0;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .mega-column a::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 1px;
          background-color: var(--color-gold);
          transition: width 0.2s ease;
        }
        
        .mega-column a:hover {
          color: var(--color-gold);
          padding-left: 1rem;
        }
        
        .mega-column a:hover::before {
          width: 0.5rem;
        }
        
        .mega-featured {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          transition: all 0.3s ease;
        }
        
        .mega-featured:hover {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.25) 0%, rgba(212, 175, 55, 0.1) 100%);
          border-color: rgba(212, 175, 55, 0.4);
        }
        
        .mega-featured a {
          text-align: center;
          padding: 1.5rem;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .mega-featured a::before {
          display: none;
        }
        
        .mega-featured a:hover {
          padding-left: 1.5rem;
        }
        
        .mega-featured-text {
          font-size: 1.1rem;
          color: var(--color-gold);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }
        
        .mega-featured:hover .mega-featured-text {
          transform: scale(1.05);
        }
        
        .mega-featured a:hover .mega-featured-text {
          text-decoration: underline;
        }
        
        .nav-icons {
          gap: 1.5rem;
        }
        .icon-btn {
          color: var(--color-text);
          transition: color 0.2s, transform 0.2s;
        }
        .icon-btn:hover {
          color: var(--color-gold);
          transform: scale(1.1);
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
          animation: cartPop 0.3s ease;
        }
        @keyframes cartPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .mobile-toggle {
          display: block;
          color: var(--color-text);
        }
        
        /* Mobile Menu */
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: var(--color-surface);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 99;
          max-height: 80vh;
          overflow-y: auto;
        }
        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .mobile-menu > a {
          font-size: 1rem;
          color: var(--color-text);
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }
        
        /* Mobile Dropdown */
        .mobile-dropdown {
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }
        
        .mobile-dropdown-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          font-size: 1rem;
          color: var(--color-text);
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .mobile-dropdown-toggle .chevron {
          transition: transform 0.3s ease;
        }
        
        .mobile-dropdown-toggle .chevron.rotate {
          transform: rotate(180deg);
        }
        
        .mobile-submenu {
          padding: 0.5rem 0 1rem 1rem;
          animation: submenuSlide 0.3s ease;
        }
        
        @keyframes submenuSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .mobile-submenu-section {
          margin-bottom: 1rem;
        }
        
        .mobile-submenu-title {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-gold);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }
        
        .mobile-submenu a {
          display: block;
          font-size: 0.9rem;
          color: var(--color-text-muted);
          padding: 0.4rem 0;
          text-align: left !important;
        }
        
        .mobile-submenu a:hover {
          color: var(--color-gold);
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
        
        @media (min-width: 768px) and (max-width: 1100px) {
          .desktop-menu {
            gap: 1rem;
          }
          .nav-link {
            font-size: 0.7rem;
            letter-spacing: 0.5px;
          }
          .mega-dropdown {
            min-width: 580px;
            padding: 2rem;
            left: 0;
            transform: translateX(0);
          }
          .mega-dropdown::before {
            left: 20px;
          }
          .mega-dropdown-content {
            gap: 1.5rem;
            grid-template-columns: repeat(3, 1fr);
          }
          .mega-featured {
            display: none;
          }
          .mega-column h4 {
            font-size: 0.7rem;
          }
          .mega-column a {
            font-size: 0.85rem;
            padding: 0.5rem 0;
          }
        }
        
        @media (min-width: 1100px) and (max-width: 1300px) {
          .desktop-menu {
            gap: 1.5rem;
          }
          .nav-link {
            font-size: 0.8rem;
          }
          .mega-dropdown {
            min-width: 680px;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
