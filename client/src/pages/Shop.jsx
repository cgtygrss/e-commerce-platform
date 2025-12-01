import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('cat');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await getProducts();
                if (categoryFilter) {
                    setProducts(data.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase()));
                } else {
                    setProducts(data);
                }
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryFilter]);

    const categories = ['Necklaces', 'Rings', 'Earrings', 'Bracelets'];

    return (
        <div className="shop-page container section">
            <div className="shop-header text-center">
                <h1 className="page-title">Shop Collection</h1>
                <p className="page-subtitle">Explore our exquisite range of handcrafted jewelry.</p>
            </div>

            <div className="filters flex items-center justify-between">
                <div className="category-filters">
                    <button
                        className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
                        onClick={() => setSearchParams({})}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`filter-btn ${categoryFilter === cat.toLowerCase() ? 'active' : ''}`}
                            onClick={() => setSearchParams({ cat: cat.toLowerCase() })}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="sort-filter">
                    <select className="sort-select">
                        <option value="newest">Newest</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading text-center">Loading products...</div>
            ) : (
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="no-products text-center">No products found in this category.</div>
                    )}
                </div>
            )}

            <style>{`
        .shop-header {
          margin-bottom: 3rem;
        }
        .page-title {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .page-subtitle {
          color: var(--color-text-muted);
        }
        .filters {
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .category-filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.5rem 1.5rem;
          border: 1px solid rgba(255,255,255,0.1);
          color: var(--color-text-muted);
          transition: all 0.3s;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 1px;
        }
        .filter-btn:hover, .filter-btn.active {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .sort-select {
          background-color: transparent;
          color: var(--color-text);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.5rem 1rem;
          outline: none;
          cursor: pointer;
        }
        .loading {
          padding: 4rem 0;
          color: var(--color-text-muted);
        }
        .product-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 768px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
        </div>
    );
};

export default Shop;
