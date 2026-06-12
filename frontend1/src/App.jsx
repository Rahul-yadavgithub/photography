import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SessionTimeoutManager from './components/auth/SessionTimeoutManager';
import useSEO from './hooks/useSEO';
import ScrollToTop from './components/common/ScrollToTop';

// Layout
import Layout from './components/layout/Layout';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import Dashboard from './pages/Dashboard';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import PackagesDashboard from './pages/Packages/PackagesDashboard';
import PackageEditor from './pages/Packages/PackageEditor';
import PortfolioManagement from './pages/PortfolioManagement';
import StoreCategoriesManager from './pages/Store/CategoriesManager';
import ProductsManager from './pages/Store/ProductsManager';
import ProductEditor from './pages/Store/ProductEditor';

// Categories Module
import CategoriesDashboard from './pages/Categories/CategoriesDashboard';
import CategoryEditor from './pages/Categories/CategoryEditor';

// Wedding Films Module
import WeddingFilmsLayout from './pages/WeddingFilms/WeddingFilmsLayout';
import FilmsDashboard from './pages/WeddingFilms/FilmsDashboard';
import SignatureFilmsList from './pages/WeddingFilms/SignatureFilms/SignatureFilmsList';
import FilmEditor from './pages/WeddingFilms/SignatureFilms/FilmEditor';
import ReelsList from './pages/WeddingFilms/Reels/ReelsList';
import ReelEditor from './pages/WeddingFilms/Reels/ReelEditor';
import CategoriesManager from './pages/WeddingFilms/Categories/CategoriesManager';
import CollectionsManager from './pages/WeddingFilms/Collections/CollectionsManager';
import BTSManager from './pages/WeddingFilms/BehindTheScenes/BTSManager';
import FilmsAnalytics from './pages/WeddingFilms/Analytics/FilmsAnalytics';

// Shoot Inspiration Module
import ShootInspirationLayout from './pages/ShootInspiration/ShootInspirationLayout';
import PoseCategoriesManager from './pages/ShootInspiration/PoseCategories/CategoriesManager';
import CategoryPosesManager from './pages/ShootInspiration/Poses/CategoryPosesManager';
import ReelsManager from './pages/ShootInspiration/Reels/ReelsManager';
import LocationsManager from './pages/ShootInspiration/Locations/LocationsManager';
import OutfitsManager from './pages/ShootInspiration/Outfits/OutfitsManager';
import CuratedCollectionsManager from './pages/ShootInspiration/Collections/CollectionsManager';

// Bookings & Inquiries Module
import BookingsLayout from './pages/Bookings/BookingsLayout';
import BookingsDashboard from './pages/Bookings/BookingsDashboard';
import InquiryListView from './pages/Bookings/InquiryListView';
import InquiryDetailView from './pages/Bookings/InquiryDetailView';

// Store Orders Module
import StoreOrdersLayout from './pages/StoreOrders/StoreOrdersLayout';
import StoreOrdersDashboard from './pages/StoreOrders/StoreOrdersDashboard';
import OrderListView from './pages/StoreOrders/OrderListView';
import OrderDetailView from './pages/StoreOrders/OrderDetailView';

// Global Website CMS Module
import WebsiteContentLayout from './pages/WebsiteContent/WebsiteContentLayout';
import HeroEditor from './pages/WebsiteContent/Sections/HeroEditor';
import SEOEditor from './pages/WebsiteContent/Global/SEOEditor';
import ContactEditor from './pages/WebsiteContent/Global/ContactEditor';

// Customers Module
import CustomersDashboard from './pages/Customers/CustomersDashboard';

function App() {
  // Global SEO wrapper for Admin Dashboard
  useSEO();

  return (
    <ProtectedRoute>
      <SessionTimeoutManager />
      <NotificationProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/packages" element={<PackagesDashboard />} />
            <Route path="/packages/create" element={<PackageEditor />} />
            <Route path="/packages/:id" element={<PackageEditor />} />
            
            {/* Categories */}
            <Route path="/categories" element={<CategoriesDashboard />} />
            <Route path="/categories/create" element={<CategoryEditor />} />
            <Route path="/categories/:id" element={<CategoryEditor />} />
            
            {/* Films Management Routes */}
            <Route path="/films" element={<WeddingFilmsLayout />}>
              <Route index element={<FilmsDashboard />} />
              <Route path="signature" element={<SignatureFilmsList />} />
              <Route path="signature/create" element={<FilmEditor />} />
              <Route path="signature/edit/:id" element={<FilmEditor />} />
              <Route path="reels" element={<ReelsList />} />
              <Route path="reels/create" element={<ReelEditor />} />
              <Route path="reels/edit/:id" element={<ReelEditor />} />
              <Route path="categories" element={<CategoriesManager />} />
              <Route path="collections" element={<CollectionsManager />} />
              <Route path="bts" element={<BTSManager />} />
              <Route path="analytics" element={<FilmsAnalytics />} />
            </Route>

            {/* Shoot Inspiration Module Routes */}
            <Route path="/shoot" element={<ShootInspirationLayout />}>
              <Route index element={<PoseCategoriesManager />} />
              <Route path="categories/:categoryId/poses" element={<CategoryPosesManager />} />
              <Route path="reels" element={<ReelsManager />} />
              <Route path="locations" element={<LocationsManager />} />
              <Route path="outfits" element={<OutfitsManager />} />
              <Route path="collections" element={<CuratedCollectionsManager />} />
            </Route>

            {/* Bookings Module */}
            <Route path="/bookings" element={<BookingsLayout />}>
              <Route index element={<BookingsDashboard />} />
              <Route path="category/:categoryId" element={<InquiryListView />} />
              <Route path="inquiry/:inquiryId" element={<InquiryDetailView />} />
            </Route>

            {/* Store Orders Module */}
            <Route path="/store-orders" element={<StoreOrdersLayout />}>
              <Route index element={<StoreOrdersDashboard />} />
              <Route path="category/:categoryId" element={<OrderListView />} />
              <Route path="order/:orderId" element={<OrderDetailView />} />
            </Route>

            {/* Global Website CMS Module Routes */}
            <Route path="/content" element={<WebsiteContentLayout />}>
              <Route index element={<Navigate to="hero" replace />} />
              <Route path="hero" element={<HeroEditor />} />
              <Route path="seo" element={<SEOEditor />} />
              <Route path="contact" element={<ContactEditor />} />
            </Route>

            <Route path="/customers" element={<CustomersDashboard />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/testimonials" element={<Reviews />} />
            <Route path="/portfolio" element={<PortfolioManagement />} />
            <Route path="/store-admin" element={<Navigate to="/store-admin/products" replace />} />
            <Route path="/store-admin/categories" element={<StoreCategoriesManager />} />
            <Route path="/store-admin/products" element={<ProductsManager />} />
            <Route path="/store-admin/products/create" element={<ProductEditor />} />
            <Route path="/store-admin/products/:id" element={<ProductEditor />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </NotificationProvider>
    </ProtectedRoute>
  );
}

export default App;
