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
import CartDrawer from './components/Store/CartDrawer';
import PortfolioPage from './pages/PortfolioPage';
import PremiumBookingFlow from './components/BookingFlow/PremiumBookingFlow';
import CustomerDashboard from './pages/CustomerDashboard';



function App() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans overflow-x-hidden">
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
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/product/:slug" element={<ProductDetailPage />} />
            <Route path="/dashboard" element={<CustomerDashboard />} />
          </Routes>
        </main>
        <Footer />
    </div>
  );
}

export default App;
