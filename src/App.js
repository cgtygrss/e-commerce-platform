import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Collections from './pages/Collections';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminRoute from './components/AdminRoute';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';

// Placeholder components for other pages
const About = () => <div className="pt-32 text-center"><h1 className="text-4xl font-serif">About Us</h1></div>;
const Contact = () => <div className="pt-32 text-center"><h1 className="text-4xl font-serif">Contact Us</h1></div>;
const Blog = () => <div className="pt-32 text-center"><h1 className="text-4xl font-serif">Journal</h1></div>;
const FAQ = () => <div className="pt-32 text-center"><h1 className="text-4xl font-serif">FAQ</h1></div>;

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Layout>
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/collections/:category" element={<Collections />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />

              {/* Admin Routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin/productlist" element={<ProductList />} />
                <Route path="/admin/product/create" element={<ProductEdit />} />
                <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
              </Route>
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
