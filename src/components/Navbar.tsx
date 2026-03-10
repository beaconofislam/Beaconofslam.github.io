import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Youtube, Music2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated auth state
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For demo purposes, let's assume user is logged in if they are on the dashboard
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setIsLoggedIn(true);
    }
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Articles', path: '/articles' },
    { name: 'Media Library', path: '/media' },
    { name: 'Contact', path: '/contact' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-black/80 backdrop-blur-lg border-b border-white/10 ${scrolled ? 'py-4' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-brand-orange tracking-tighter">
          Beacon of Islam
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-brand-orange ${location.pathname === link.path ? 'text-brand-orange' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
            <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-orange transition-colors">
              <Youtube size={18} />
            </a>
            <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-orange transition-colors">
              <Music2 size={18} />
            </a>
          </div>
          
          {isLoggedIn ? (
            <Link to="/dashboard" className="flex items-center gap-3 pl-4 border-l border-white/10 group">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden group-hover:border-brand-orange transition-colors">
                <img src="https://picsum.photos/seed/user123/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Dashboard</span>
            </Link>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-6 text-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 md:hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium ${location.pathname === link.path ? 'text-brand-orange' : 'text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <a href="https://youtube.com/@beaconofislam" target="_blank" rel="noopener noreferrer" className="text-gray-400">
                  <Youtube size={24} />
                </a>
                <a href="https://tiktok.com/@islamic_updates2025" target="_blank" rel="noopener noreferrer" className="text-gray-400">
                  <Music2 size={24} />
                </a>
              </div>
              
              {isLoggedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 glass-card"
                >
                  <div className="w-10 h-10 rounded-full border border-white/20 overflow-hidden">
                    <img src="https://picsum.photos/seed/user123/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Abdul Muiz</p>
                    <p className="text-xs text-gray-400">View Dashboard</p>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary justify-center py-4"
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
