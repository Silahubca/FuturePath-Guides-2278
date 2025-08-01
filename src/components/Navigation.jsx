import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMenu, FiX } = FiIcons;

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNavClick = () => {
    closeMenu();
    scrollToTop();
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/ai-job-search', label: 'AI Job Search' },
    { to: '/ai-entrepreneur', label: 'AI Entrepreneur' },
    { to: '/financial-freedom', label: 'Financial Freedom' },
    { to: '/complete-collection', label: 'Complete Collection' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-[#ffffff] shadow-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={handleNavClick} className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-[#131319] rounded-md flex items-center justify-center">
              <div className="h-8 w-8 bg-[#ffffff] rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-[#131319] rounded-full"></div>
              </div>
            </div>
            <span className="text-[#131319] font-bold text-xl">FuturePath Guides</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[#131319] hover:text-gray-700 font-medium ${
                  location.pathname === link.to ? 'border-b-2 border-[#131319]' : ''
                }`}
                onClick={handleNavClick}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#131319] hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <SafeIcon icon={isMenuOpen ? FiX : FiMenu} className="text-2xl" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-[#ffffff] border-t border-gray-200 mt-4"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[#131319] hover:text-gray-700 font-medium py-2 ${
                    location.pathname === link.to ? 'border-l-4 border-[#131319] pl-3' : 'pl-4'
                  }`}
                  onClick={handleNavClick}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;