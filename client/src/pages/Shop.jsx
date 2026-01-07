import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import { getProducts } from '../services/api';

// Helper function to get color hex values for display
const getColorHex = (colorName) => {
  const colorMap = {
    'Gold': '#D4AF37',
    'Silver': '#C0C0C0',
    'Rose Gold': '#B76E79',
    'White': '#FFFFFF',
    'Black': '#1a1a1a',
    'Blue': '#4169E1',
    'Green': '#50C878',
    'Red': '#DC143C',
  };
  return colorMap[colorName] || '#888888';
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  
  const categoryFilter = searchParams.get('cat');
  const searchQuery = searchParams.get('search');

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Extract unique colors and materials from products
  const { availableColors, availableMaterials, minPrice, maxPrice } = useMemo(() => {
    const colors = [...new Set(products.map(p => p.color).filter(Boolean))];
    const materials = [...new Set(products.map(p => p.material).filter(Boolean))];
    const prices = products.map(p => p.price);
    return { 
      availableColors: colors, 
      availableMaterials: materials,
      minPrice: prices.length ? Math.floor(Math.min(...prices)) : 0,
      maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : 1000
    };
  }, [products]);

  // Initialize price range when products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, products.length]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > minPrice || priceRange[1] < maxPrice) count++;
    if (inStockOnly) count++;
    if (selectedColors.length > 0) count++;
    if (selectedMaterials.length > 0) count++;
    return count;
  }, [priceRange, minPrice, maxPrice, inStockOnly, selectedColors, selectedMaterials]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (categoryFilter) {
      result = result.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Search filter
    if (searchQuery) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter(p => selectedColors.includes(p.color));
    }

    // Material filter
    if (selectedMaterials.length > 0) {
      result = result.filter(p => selectedMaterials.includes(p.material));
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [products, categoryFilter, searchQuery, priceRange, inStockOnly, selectedColors, selectedMaterials, sortBy]);

  const categories = ['Necklaces', 'Rings', 'Earrings', 'Bracelets'];

  const handleCategoryClick = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat) {
      newParams.set('cat', cat.toLowerCase());
    } else {
      newParams.delete('cat');
    }
    setSearchParams(newParams);
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleMaterial = (material) => {
    setSelectedMaterials(prev => 
      prev.includes(material) ? prev.filter(m => m !== material) : [...prev, material]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([minPrice, maxPrice]);
    setInStockOnly(false);
    setSelectedColors([]);
    setSelectedMaterials([]);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShowFilterModal(false);
    };
    if (showFilterModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showFilterModal]);

  return (
    <div className="shop-page container section">
      <div className="shop-header text-center">
        <h1 className="page-title">Shop Collection</h1>
        <p className="page-subtitle">Explore our exquisite range of handcrafted jewelry.</p>
      </div>

      {/* Controls Bar */}
      <div className="shop-controls">
        <div className="category-filters">
          <button
            className={`filter-btn ${!categoryFilter ? 'active' : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${categoryFilter === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="controls-right">
          <button 
            className={`filter-toggle-btn ${activeFilterCount > 0 ? 'active' : ''}`}
            onClick={() => setShowFilterModal(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters
            {activeFilterCount > 0 && <span className="filter-badge">{activeFilterCount}</span>}
          </button>
          <select 
            className="sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="filter-modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="filter-modal-header">
              <h2>Filters</h2>
              <button className="close-modal-btn" onClick={() => setShowFilterModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="filter-modal-body">
              {/* Color Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Color</h4>
                <div className="filter-chips">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      className={`filter-chip ${selectedColors.includes(color) ? 'active' : ''}`}
                      onClick={() => toggleColor(color)}
                    >
                      <span className="color-dot" style={{ backgroundColor: getColorHex(color) }}></span>
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Filter */}
              <div className="filter-section">
                <h4 className="filter-title">Material</h4>
                <div className="filter-chips">
                  {availableMaterials.map(material => (
                    <button
                      key={material}
                      className={`filter-chip ${selectedMaterials.includes(material) ? 'active' : ''}`}
                      onClick={() => toggleMaterial(material)}
                    >
                      {material}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4 className="filter-title">Price Range</h4>
                <div className="price-range-display">
                  ${priceRange[0]} — ${priceRange[1]}
                </div>
                <div className="price-sliders">
                  <input
                    type="range"
                    className="price-slider"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 10), priceRange[1]])}
                  />
                  <input
                    type="range"
                    className="price-slider"
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 10)])}
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="filter-section">
                <h4 className="filter-title">Availability</h4>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-label">In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="filter-modal-footer">
              <button className="clear-btn" onClick={clearAllFilters}>
                Clear All
              </button>
              <button className="apply-btn" onClick={() => setShowFilterModal(false)}>
                Show {filteredAndSortedProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div className="results-info">
        {filteredAndSortedProducts.length} product{filteredAndSortedProducts.length !== 1 ? 's' : ''} found
      </div>

      {loading ? (
        <div className="loading text-center">Loading products...</div>
      ) : (
        <div className="product-grid">
          {filteredAndSortedProducts.length > 0 ? (
            filteredAndSortedProducts.map((product, index) => (
              <ScrollReveal key={product._id} delay={index * 0.05}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))
          ) : (
            <div className="no-products text-center">No products found matching your filters.</div>
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
        .shop-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .controls-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        .category-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .filter-btn {
          padding: 0.5rem 1.25rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: var(--color-text-muted);
          transition: all 0.3s;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 1px;
          cursor: pointer;
        }
        .filter-btn:hover, .filter-btn.active {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.85rem;
        }
        .filter-toggle-btn:hover, .filter-toggle-btn.active {
          border-color: var(--color-gold);
          color: var(--color-gold);
        }
        .filter-badge {
          background: #D4AF37;
          color: #1a1a1a;
          font-size: 0.7rem;
          font-weight: bold;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sort-select {
          background-color: #1a1a1a;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 0.5rem 1rem;
          outline: none;
          cursor: pointer;
          font-size: 0.85rem;
        }
        .results-info {
          margin-bottom: 1.5rem;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        /* Filter Modal */
        .filter-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .filter-modal {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          max-height: 85vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .filter-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .filter-modal-header h2 {
          font-size: 1.25rem;
          color: #D4AF37;
          margin: 0;
        }
        .close-modal-btn {
          background: transparent;
          border: none;
          color: #999;
          cursor: pointer;
          padding: 0.25rem;
        }
        .close-modal-btn:hover {
          color: #fff;
        }
        .filter-modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        .filter-section {
          margin-bottom: 2rem;
        }
        .filter-section:last-child {
          margin-bottom: 0;
        }
        .filter-title {
          color: #fff;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .filter-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 25px;
          background: rgba(255,255,255,0.05);
          color: #ccc;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.85rem;
        }
        .filter-chip:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
          background: rgba(255,255,255,0.1);
        }
        .filter-chip.active {
          border-color: #D4AF37;
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.15);
        }
        .color-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          flex-shrink: 0;
        }
        .price-range-display {
          font-size: 1.1rem;
          color: #fff;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 500;
        }
        .price-sliders {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .price-slider {
          width: 100%;
          accent-color: #D4AF37;
          cursor: pointer;
        }
        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
        }
        .toggle-switch input {
          display: none;
        }
        .toggle-slider {
          width: 50px;
          height: 28px;
          background: rgba(255,255,255,0.15);
          border-radius: 14px;
          position: relative;
          transition: background 0.3s;
        }
        .toggle-slider::after {
          content: '';
          position: absolute;
          width: 22px;
          height: 22px;
          background: #888;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: all 0.3s;
        }
        .toggle-switch input:checked + .toggle-slider {
          background: #D4AF37;
        }
        .toggle-switch input:checked + .toggle-slider::after {
          transform: translateX(22px);
          background: #1a1a1a;
        }
        .toggle-label {
          color: #fff;
          font-size: 0.9rem;
        }
        .filter-modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .clear-btn {
          flex: 1;
          padding: 0.9rem 1rem;
          border: 1px solid rgba(255,255,255,0.25);
          background: transparent;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
          border-radius: 6px;
          font-weight: 500;
        }
        .clear-btn:hover {
          border-color: #fff;
          background: rgba(255,255,255,0.05);
        }
        .apply-btn {
          flex: 2;
          padding: 0.9rem 1rem;
          border: none;
          background: #D4AF37;
          color: #1a1a1a;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 6px;
        }
        .apply-btn:hover {
          background: #c4a032;
        }

        .loading {
          padding: 4rem 0;
          color: var(--color-text-muted);
        }
        .no-products {
          grid-column: 1 / -1;
          padding: 4rem 0;
          color: var(--color-text-muted);
          text-align: center;
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
        @media (max-width: 768px) {
          .shop-controls {
            flex-direction: column;
            align-items: stretch;
          }
          .controls-right {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default Shop;
