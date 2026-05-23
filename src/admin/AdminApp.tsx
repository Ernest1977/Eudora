import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import AdminLayout from './components/AdminLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import FormulasPage from './pages/FormulasPage';
import TestimonialsPage from './pages/TestimonialsPage';
import GalleryPage from './pages/GalleryPage';
import ClientsPage from './pages/ClientsPage';
import InvoicesPage from './pages/InvoicesPage';
import MessagesPage from './pages/MessagesPage';
import SettingsPage from './pages/SettingsPage';

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="hero" element={<HeroPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="formulas" element={<FormulasPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
