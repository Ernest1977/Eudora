import { Routes, Route } from 'react-router-dom';
import './i18n';
import AdminApp from './admin/AdminApp';

// Site vitrine (page d'accueil)
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Formulas from './components/Formulas';
import Combo from './components/Combo';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';

function SiteVitrine() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Formulas />
        <Combo />
        <Testimonials />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Dashboard Admin */}
      <Route path="/admin/*" element={<AdminApp />} />

      {/* Site vitrine */}
      <Route path="*" element={<SiteVitrine />} />
    </Routes>
  );
}
