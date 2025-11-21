import React from 'react';
import { FaInstagram, FaPinterest, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand & Newsletter */}
                    <div className="md:col-span-1">
                        <h3 className="text-2xl font-serif mb-4 text-secondary">LUMIÈRE</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Crafting timeless elegance for the modern soul.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><FaInstagram size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><FaPinterest size={20} /></a>
                            <a href="#" className="text-gray-400 hover:text-secondary transition-colors"><FaFacebookF size={20} /></a>
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-lg font-serif mb-6">Shop</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="/collections/all" className="hover:text-secondary transition-colors">All Collections</a></li>
                            <li><a href="/collections/rings" className="hover:text-secondary transition-colors">Rings</a></li>
                            <li><a href="/collections/necklaces" className="hover:text-secondary transition-colors">Necklaces</a></li>
                            <li><a href="/collections/earrings" className="hover:text-secondary transition-colors">Earrings</a></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="text-lg font-serif mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="/about" className="hover:text-secondary transition-colors">About Us</a></li>
                            <li><a href="/contact" className="hover:text-secondary transition-colors">Contact</a></li>
                            <li><a href="/blog" className="hover:text-secondary transition-colors">Journal</a></li>
                            <li><a href="/faq" className="hover:text-secondary transition-colors">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-serif mb-6">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-transparent border-b border-gray-600 py-2 text-white focus:outline-none focus:border-secondary transition-colors"
                            />
                            <button className="text-left text-sm uppercase tracking-widest hover:text-secondary transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-500 text-xs">
                    <p>&copy; {new Date().getFullYear()} Lumière Jewellery. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
