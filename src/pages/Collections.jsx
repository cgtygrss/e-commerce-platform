import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Collections = () => {
    const [filter, setFilter] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    const categories = ['All', 'Rings', 'Earrings', 'Necklaces', 'Bracelets'];

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="pt-20 pb-20 px-4 max-w-7xl mx-auto">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-serif text-center mb-12"
            >
                Our Collections
            </motion.h1>

            {/* Filters */}
            <div className="flex justify-center space-x-8 mb-16 overflow-x-auto pb-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`uppercase text-sm tracking-widest pb-1 border-b-2 transition-colors whitespace-nowrap ${filter === cat ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-primary'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
            >
                {filteredProducts.map((product) => (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={product._id}
                    >
                        <Link to={`/product/${product._id}`} className="group block">
                            <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <button className="w-full bg-white text-primary py-3 uppercase text-xs tracking-widest hover:bg-primary hover:text-white transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-serif group-hover:text-secondary transition-colors">{product.name}</h3>
                            <p className="text-gray-500">${product.price}.00</p>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Collections;
