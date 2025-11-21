import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditMode = id !== undefined;

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [isBestseller, setIsBestseller] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const { data } = await axios.get(`/api/products/${id}`);
                    setName(data.name);
                    setPrice(data.price);
                    setImage(data.image);
                    setCategory(data.category);
                    setDescription(data.description);
                    setIsBestseller(data.isBestseller);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const productData = {
                name,
                price,
                image,
                category,
                description,
                isBestseller,
            };

            if (isEditMode) {
                await axios.put(`/api/products/${id}`, productData, config);
            } else {
                await axios.post('/api/products', productData, config);
            }
            navigate('/admin/productlist');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-12 pt-32">
            <Link to="/admin/productlist" className="text-gray-600 hover:text-primary mb-6 inline-block">
                &larr; Go Back
            </Link>
            <h1 className="text-3xl font-serif text-primary mb-8">{isEditMode ? 'Edit Product' : 'Create Product'}</h1>

            <form onSubmit={submitHandler} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="number"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                        type="text"
                        placeholder="Enter image url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                        type="text"
                        placeholder="Enter category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        placeholder="Enter description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary h-32"
                        required
                    ></textarea>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isBestseller"
                        checked={isBestseller}
                        onChange={(e) => setIsBestseller(e.target.checked)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isBestseller" className="ml-2 block text-sm text-gray-900">
                        Is Bestseller
                    </label>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded hover:bg-secondary transition-colors uppercase tracking-widest font-medium"
                >
                    {isEditMode ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    );
};

export default ProductEdit;
