import React from 'react';
import Hero from '../components/Hero';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div>
            <Hero />

            {/* Featured Collection */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif mb-4">The Signature Collection</h2>
                    <p className="text-gray-500 mb-12 max-w-2xl mx-auto">Discover our most coveted pieces, designed to elevate your everyday style with a touch of luxury.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="group cursor-pointer">
                                <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
                                    <img
                                        src={`https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                                        alt="Jewelry Item"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                                </div>
                                <h3 className="text-lg font-serif">Gold Vermeil Ring</h3>
                                <p className="text-gray-500">$129.00</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Link to="/collections" className="inline-block border-b border-primary pb-1 uppercase tracking-widest text-sm hover:text-secondary hover:border-secondary transition-colors">
                            View All Collections
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="py-20 bg-accent bg-opacity-30">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="relative aspect-square md:aspect-[16/9] overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Earrings"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                                <h3 className="text-white text-3xl font-serif tracking-wider">Earrings</h3>
                            </div>
                        </div>
                        <div className="relative aspect-square md:aspect-[16/9] overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1602751584552-8ba43d99d2cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Necklaces"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all">
                                <h3 className="text-white text-3xl font-serif tracking-wider">Necklaces</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-serif mb-12">"The quality is absolutely stunning. It feels like wearing a piece of art."</h2>
                    <p className="text-gray-500 uppercase tracking-widest text-xs">- Sarah M., New York</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
