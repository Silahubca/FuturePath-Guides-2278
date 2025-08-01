import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLinkedin, FiFacebook, FiInstagram, FiYoutube } = FiIcons;

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-[#131319] text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" onClick={scrollToTop}>
              <h3 className="text-2xl font-bold mb-4 text-[#ffffff]">
                FuturePath Guides
              </h3>
            </Link>
            <p className="text-[#ffffff] mb-6 max-w-md">
              Empowering your journey to success with clear, actionable blueprints for career growth, business creation, and financial freedom.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[#ffffff] transition-colors">
                <SafeIcon icon={FiLinkedin} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ffffff] transition-colors">
                <SafeIcon icon={FiFacebook} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ffffff] transition-colors">
                <SafeIcon icon={FiInstagram} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ffffff] transition-colors">
                <SafeIcon icon={FiYoutube} className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/ai-job-search" className="text-[#ffffff] hover:text-white transition-colors text-left block" onClick={scrollToTop}>
                  AI Job Search
                </Link>
              </li>
              <li>
                <Link to="/ai-entrepreneur" className="text-[#ffffff] hover:text-white transition-colors text-left block" onClick={scrollToTop}>
                  AI Entrepreneur
                </Link>
              </li>
              <li>
                <Link to="/financial-freedom" className="text-[#ffffff] hover:text-white transition-colors text-left block" onClick={scrollToTop}>
                  Financial Freedom
                </Link>
              </li>
              <li>
                <Link to="/complete-collection" className="text-[#ffffff] hover:text-white transition-colors text-left block" onClick={scrollToTop}>
                  Complete Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-[#ffffff] hover:text-white transition-colors text-left block" onClick={scrollToTop}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-[#ffffff] hover:text-white transition-colors text-left block" onClick={scrollToTop}>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#ffffff] hover:text-white transition-colors flex items-center text-left" onClick={scrollToTop}>
                  <SafeIcon icon={FiMail} className="mr-2" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} FuturePath Guides. All rights reserved. |
            <span className="text-[#ffffff]"> {' '}Your roadmap to a confident future starts here.</span>
          </p>
          <p className="text-gray-500 text-sm mt-2">
            All digital products are non-refundable and for individual use only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;