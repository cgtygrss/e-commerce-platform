import React, { useState, useContext, useEffect, FormEvent } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';

interface Subcategory {
    label: string;
    link: string;
}

interface MenuCategory {
    name: string;
    category: string;
    subcategories: Subcategory[];
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const { cartItems } = cart;
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
            setShowSearch(false);
            setSearchQuery('');
        }
    };

    const menuCategories: MenuCategory[] = [
        {
            name: 'Necklaces',
            category: 'necklaces',
            subcategories: [
                { label: 'All Necklaces', link: '/shop?cat=necklaces' },
                { label: 'Pendants', link: '/shop?cat=necklaces&type=pendant' },
                { label: 'Chains', link: '/shop?cat=necklaces&type=chain' },
                { label: 'Lockets', link: '/shop?cat=necklaces&type=locket' },
            ],
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
        },
        {
            name: 'Rings',
            category: 'rings',
            subcategories: [
                { label: 'All Rings', link: '/shop?cat=rings' },
                { label: 'Engagement', link: '/shop?cat=rings&type=engagement' },
                { label: 'Wedding Bands', link: '/shop?cat=rings&type=wedding' },
                { label: 'Statement', link: '/shop?cat=rings&type=statement' },
            ],
        },
    ];

    const handleDropdownEnter = (category: string) => {
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
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        Velora
                    </Link>

                    {/* Desktop Menu */}
                    <div className="desktop-menu">
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
                                    <div className="dropdown-menu">
                                        <div className="dropdown-content">
                                            {cat.subcategories.map((sub) => (
                                                <Link
                                                    key={sub.label}
                                                    to={sub.link}
                                                    onClick={handleLinkClick}
                                                    className="dropdown-item"
                                                >
                                                    {sub.label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </div>

                    {/* Icons */}
                    <div className="nav-icons">
                        {showSearch ? (
                            <form onSubmit={handleSearch} className="search-form">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button type="button" onClick={() => setShowSearch(false)} className="icon-btn">
                                    <X size={18} />
                                </button>
                            </form>
                        ) : (
                            <button className="icon-btn" onClick={() => setShowSearch(true)} aria-label="Search">
                                <Search size={20} strokeWidth={1.5} />
                            </button>
                        )}

                        {user ? (
                            <Link to="/profile" className="icon-btn" aria-label="Profile">
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                        ) : (
                            <Link to="/login" className="icon-btn" aria-label="Login">
                                <User size={20} strokeWidth={1.5} />
                            </Link>
                        )}

                        <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {cartItems.length > 0 && (
                                <span className="cart-count">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>

                        <button
                            className="mobile-toggle"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <div className="mobile-menu-content">
                    {menuCategories.map((cat) => (
                        <div key={cat.name} className="mobile-dropdown">
                            <button
                                className="mobile-dropdown-toggle"
                                onClick={() => setMobileSubmenu(mobileSubmenu === cat.name ? null : cat.name)}
                            >
                                {cat.name}
                                <span className={`chevron ${mobileSubmenu === cat.name ? 'rotate' : ''}`}>›</span>
                            </button>

                            {mobileSubmenu === cat.name && (
                                <div className="mobile-submenu">
                                    {cat.subcategories.map((sub) => (
                                        <Link
                                            key={sub.label}
                                            to={sub.link}
                                            onClick={handleLinkClick}
                                            className="mobile-submenu-item"
                                        >
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <Link to="/about" onClick={handleLinkClick} className="mobile-link">About</Link>
                    <Link to="/contact" onClick={handleLinkClick} className="mobile-link">Contact</Link>

                    <div className="mobile-divider"></div>

                    {user ? (
                        <>
                            <Link to="/profile" onClick={handleLinkClick} className="mobile-link">My Profile</Link>
                            <button onClick={() => { logout(); handleLinkClick(); }} className="mobile-link logout">
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={handleLinkClick} className="mobile-link">Sign In</Link>
                    )}
                </div>
            </div>

            <style>{`
        .navbar {
          padding: 1.25rem 0;
          background-color: var(--color-bg);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all var(--transition-normal);
          border-bottom: 1px solid transparent;
        }
        
        .navbar.scrolled {
          padding: 0.875rem 0;
          background-color: rgba(253, 252, 250, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom-color: var(--color-border);
          box-shadow: var(--shadow-sm);
        }
        
        .nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        /* Logo */
        .logo {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 400;
          color: var(--color-text);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          transition: color var(--transition-fast);
        }
        
        .logo:hover {
          color: var(--color-accent);
        }
        
        /* Desktop Menu */
        .desktop-menu {
          display: none;
          gap: 2.5rem;
          align-items: center;
        }
        
        .nav-dropdown-wrapper {
          position: relative;
        }
        
        .nav-link {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--color-text-secondary);
          position: relative;
          transition: color var(--transition-fast);
          padding: 0.5rem 0;
          font-weight: 500;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--color-accent);
          transition: width var(--transition-normal);
        }
        
        .nav-link:hover {
          color: var(--color-text);
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        /* Dropdown Menu - Minimalist */
        .dropdown-menu {
          position: absolute;
          top: calc(100% + 0.75rem);
          left: 50%;
          transform: translateX(-50%);
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          padding: 0.75rem 0;
          animation: dropdownFade 0.2s ease;
          z-index: 1001;
          border-radius: var(--radius-md);
        }
        
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        
        .dropdown-content {
          display: flex;
          flex-direction: column;
        }
        
        .dropdown-item {
          padding: 0.625rem 1.25rem;
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }
        
        .dropdown-item:hover {
          color: var(--color-text);
          background-color: var(--color-surface-hover);
          padding-left: 1.5rem;
        }
        
        /* Icons */
        .nav-icons {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        
        .icon-btn {
          color: var(--color-text-secondary);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
        }
        
        .icon-btn:hover {
          color: var(--color-text);
          transform: scale(1.05);
        }
        
        .cart-btn {
          position: relative;
        }
        
        .cart-count {
          position: absolute;
          top: -6px;
          right: -6px;
          background-color: var(--color-accent);
          color: var(--color-primary);
          font-size: 0.65rem;
          font-weight: 600;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: cartPop 0.3s ease;
        }
        
        @keyframes cartPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        /* Search Form */
        .search-form {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.2s ease;
        }
        
        .search-form input {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          background: var(--color-surface);
          font-size: 0.85rem;
          width: 180px;
          transition: border-color var(--transition-fast);
        }
        
        .search-form input:focus {
          outline: none;
          border-color: var(--color-accent);
        }
        
        /* Mobile Toggle */
        .mobile-toggle {
          display: flex;
          color: var(--color-text);
          padding: 0.25rem;
        }
        
        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--color-bg);
          z-index: 999;
          padding-top: 5rem;
          transform: translateX(100%);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
          overflow-y: auto;
        }
        
        .mobile-menu.open {
          transform: translateX(0);
          opacity: 1;
          pointer-events: all;
        }
        
        .mobile-menu-content {
          padding: 0 var(--spacing-md) var(--spacing-xl);
          max-width: 400px;
          margin: 0 auto;
        }
        
        .mobile-link {
          display: block;
          font-size: 1.25rem;
          font-family: var(--font-display);
          color: var(--color-text);
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border);
          transition: color var(--transition-fast);
        }
        
        .mobile-link:hover {
          color: var(--color-accent);
        }
        
        .mobile-link.logout {
          width: 100%;
          text-align: left;
          background: none;
          font-family: var(--font-display);
          cursor: pointer;
        }
        
        .mobile-divider {
          height: 1px;
          background: var(--color-border);
          margin: 1.5rem 0;
        }
        
        /* Mobile Dropdown */
        .mobile-dropdown {
          border-bottom: 1px solid var(--color-border);
        }
        
        .mobile-dropdown-toggle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          font-size: 1.25rem;
          font-family: var(--font-display);
          color: var(--color-text);
          background: none;
          cursor: pointer;
        }
        
        .mobile-dropdown-toggle .chevron {
          font-size: 1.5rem;
          transition: transform 0.3s ease;
          color: var(--color-text-muted);
        }
        
        .mobile-dropdown-toggle .chevron.rotate {
          transform: rotate(90deg);
        }
        
        .mobile-submenu {
          padding: 0 0 1rem 1rem;
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
        
        .mobile-submenu-item {
          display: block;
          font-size: 0.95rem;
          color: var(--color-text-muted);
          padding: 0.5rem 0;
          transition: color var(--transition-fast);
        }
        
        .mobile-submenu-item:hover {
          color: var(--color-accent);
        }
        
        /* Responsive */
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </>
    );
};

export default Navbar;
