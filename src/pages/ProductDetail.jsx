import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const ProductDetail = () => {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                const data = await res.json();
                setProduct(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product:", error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

    return (
        <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-4"
                >
                    <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col justify-center"
                >
                    <h1 className="text-3xl md:text-4xl font-serif mb-4">{product.name}</h1>
                    <p className="text-2xl text-gray-500 mb-8">${product.price}.00</p>

                    <p className="text-gray-600 leading-relaxed mb-8">
                        {product.description}
                    </p>

                    <div className="mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Specifications</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            {product.specs && product.specs.map((spec, idx) => (
                                <li key={idx} className="flex justify-between border-b border-gray-100 pb-2">
                                    <span>{spec.label}</span>
                                    <span className="font-medium">{spec.value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex space-x-4 mb-8">
                        <div className="flex border border-gray-300">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100">-</button>
                            <span className="px-4 py-2 flex items-center">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-100">+</button>
                        </div>
                        <button
                            onClick={() => addToCart(product, quantity)}
                            className="flex-grow bg-primary text-white uppercase tracking-widest text-sm hover:bg-secondary transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-2">
                        <p>Free shipping on orders over $200</p>
                        <p>30-day return policy</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetail;
