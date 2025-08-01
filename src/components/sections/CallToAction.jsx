import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiTarget } = FiIcons;

const CallToAction = () => {
  return (
    <section className="py-20 bg-[#131319] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <SafeIcon icon={FiTarget} className="text-6xl text-[#ffffff] mx-auto mb-8" />
          <h2 className="text-4xl lg:text-5xl font-bold text-[#ffffff] mb-8">
            Ready to Design Your Future?
          </h2>
          <p className="text-xl text-[#ffffff] mb-12 leading-relaxed max-w-3xl mx-auto">
            Don't let uncertainty hold you back. FuturePath Guides is committed to providing you with the clarity, tools, and confidence to achieve your personal and professional goals. Explore our blueprints and start building the future you deserve today.
          </p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Link 
              to="/complete-collection"
              className="bg-[#ffffff] text-[#131319] hover:bg-gray-200 px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center group"
            >
              Explore All Blueprints
              <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/contact"
              className="border-2 border-[#ffffff] text-[#ffffff] hover:bg-white hover:text-[#131319] px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;