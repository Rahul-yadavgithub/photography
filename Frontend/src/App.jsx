import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import WeddingFilmsPage from './pages/WeddingFilmsPage';
import InspirationPage from './pages/InspirationPage';

import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartDrawer from './components/Store/CartDrawer';
import PortfolioPage from './pages/PortfolioPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans overflow-x-hidden">
        <Header />
        <CartDrawer />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:id" element={<PackageDetailPage />} />
            <Route path="/wedding-films" element={<WeddingFilmsPage />} />
            <Route path="/shoot" element={<InspirationPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/product/:id" element={<ProductDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
