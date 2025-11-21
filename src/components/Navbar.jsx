import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { IoBagOutline } from 'react-icons/io5';
import { FaRegUser } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { toggleCart, cartCount } = useCart();
    const { user } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setNav(false);
    }, [location]);

    const handleNav = () => setNav(!nav);

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Collections", path: "/collections" },
        { name: "About", path: "/about" },
        { name: "Contact", path: "/contact" },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                {/* Mobile Menu Button */}
                <div onClick={handleNav} className="md:hidden cursor-pointer z-50 text-primary">
                    {nav ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
                </div>

                {/* Logo */}
                <div className="flex-grow md:flex-grow-0 text-center md:text-left">
                    <Link to="/" className="text-2xl font-serif font-bold tracking-widest text-primary">
                        LUMIÈRE
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-8 uppercase text-xs tracking-widest font-medium text-gray-600">
                    {navLinks.map((link) => (
                        <li key={link.name}>
                            <Link to={link.path} className="hover:text-secondary transition-colors">
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Icons */}
                <div className="flex space-x-6 items-center text-primary">
                    {user && user.isAdmin && (
                        <Link to="/admin/productlist" className="hover:text-secondary transition-colors font-medium text-sm">
                            ADMIN
                        </Link>
                    )}
                    <Link to={user ? "/profile" : "/login"} className="hover:text-secondary transition-colors">
                        <FaRegUser size={20} />
                    </Link>
                    <button onClick={toggleCart} className="hover:text-secondary transition-colors relative">
                        <IoBagOutline size={22} />
                        <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            {cartCount}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${nav ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={handleNav}></div>

            {/* Mobile Menu Sidebar */}
            <div className={`fixed top-0 left-0 w-[75%] sm:w-[60%] h-full bg-white z-50 transition-transform duration-500 ease-in-out transform md:hidden ${nav ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-8 flex flex-col h-full">
                    <div className="mb-10">
                        <h2 className="text-2xl font-serif font-bold text-primary">LUMIÈRE</h2>
                    </div>
                    <ul className="flex flex-col space-y-6 uppercase text-sm tracking-widest font-medium text-gray-800">
                        {navLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.path} className="block hover:text-secondary transition-colors">
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-auto pt-8 border-t border-gray-100">
                        {user && user.isAdmin && (
                            <Link to="/admin/productlist" className="flex items-center space-x-4 text-gray-600 mb-4">
                                <span>Admin Dashboard</span>
                            </Link>
                        )}
                        <Link to={user ? "/profile" : "/login"} className="flex items-center space-x-4 text-gray-600 mb-4">
                            <FaRegUser size={18} />
                            <span>{user ? "My Account" : "Login / Register"}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;