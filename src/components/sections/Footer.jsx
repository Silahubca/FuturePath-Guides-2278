import React from 'react';
import { useNavigate } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiLinkedin, FiFacebook, FiInstagram, FiYoutube } = FiIcons;

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              FuturePath Guides
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Empowering your journey to success with clear, actionable blueprints for career growth, business creation, and financial freedom.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <SafeIcon icon={FiLinkedin} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <SafeIcon icon={FiFacebook} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <SafeIcon icon={FiInstagram} className="text-2xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                <SafeIcon icon={FiYoutube} className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/ai-job-search')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  AI Job Search
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/ai-entrepreneur')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  AI Entrepreneur
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/financial-freedom')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Financial Freedom
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/complete-collection')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Complete Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/privacy-policy')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/terms-of-service')}
                  className="text-gray-300 hover:text-white transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contact')}
                  className="text-gray-300 hover:text-white transition-colors flex items-center text-left"
                >
                  <SafeIcon icon={FiMail} className="mr-2" />
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 FuturePath Guides. All rights reserved. | 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {' '}Your roadmap to a confident future starts here.
            </span>
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