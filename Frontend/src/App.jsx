import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import PackagesPage from './pages/PackagesPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import PackageDetailPage from './pages/PackageDetailPage';
import WeddingFilmsPage from './pages/WeddingFilmsPage';
import FilmCategoryPage from './pages/FilmCategoryPage';
import InspirationPage from './pages/InspirationPage';

import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import StoreCheckoutPage from './pages/StoreCheckoutPage';
import CartDrawer from './components/Store/CartDrawer';
import PortfolioPage from './pages/PortfolioPage';
import CollectionDetailPage from './pages/CollectionDetailPage';
import PremiumBookingFlow from './components/BookingFlow/PremiumBookingFlow';
import CustomerDashboard from './pages/CustomerDashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SessionTimeoutManager from './components/auth/SessionTimeoutManager';
import ScrollToTop from './components/common/ScrollToTop';
import { CartProvider } from './context/CartContext';


function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans overflow-x-hidden">
          <ScrollToTop />
        <Header />
        <CartDrawer />
        <PremiumBookingFlow />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/category/:slug" element={<CategoryDetailPage />} />
            <Route path="/packages/:id" element={<PackageDetailPage />} />
            <Route path="/films" element={<WeddingFilmsPage />} />
            <Route path="/films/:slug" element={<FilmCategoryPage />} />
            <Route path="/shoot" element={<InspirationPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/portfolio/collection/:slug" element={<CollectionDetailPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/product/:slug" element={<ProductDetailPage />} />
            <Route path="/store/checkout" element={
              <ProtectedRoute>
                <StoreCheckoutPage />
              </ProtectedRoute>
            } />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <SessionTimeoutManager />
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
