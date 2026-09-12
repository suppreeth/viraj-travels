import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Packages from './pages/Packages';
import PackageDetail from './pages/PackageDetail';
import Destinations from './pages/Destinations';
import Contact from './pages/Contact';
import About from './pages/About';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div className="container" style={{paddingTop: '160px', textAlign: 'center', minHeight: '60vh'}}><h2>404 - Page Not Found</h2></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
