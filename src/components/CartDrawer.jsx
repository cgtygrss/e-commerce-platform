import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus, AiOutlineDelete } from 'react-icons/ai';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black bg-opacity-50 z-[60] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'tween', duration: 0.3 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-2xl font-serif">Shopping Bag</h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <AiOutlineClose size={24} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <p className="text-lg mb-4">Your bag is empty</p>
                                    <button onClick={toggleCart} className="text-primary underline hover:text-secondary">
                                        Continue Shopping
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-serif text-lg">{item.name}</h3>
                                                    <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                        <AiOutlineDelete size={20} />
                                                    </button>
                                                </div>
                                                <p className="text-gray-500 text-sm">${item.price}</p>
                                            </div>

                                            <div className="flex items-center border border-gray-200 w-max">
                                                <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:bg-gray-50 text-gray-600">
                                                    <AiOutlineMinus size={14} />
                                                </button>
                                                <span className="px-2 text-sm font-medium">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:bg-gray-50 text-gray-600">
                                                    <AiOutlinePlus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="text-xl font-serif font-bold">${cartTotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                                <button className="w-full bg-primary text-white py-4 uppercase tracking-widest text-sm hover:bg-secondary transition-colors">
                                    Checkout
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
