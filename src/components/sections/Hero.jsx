import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiTarget, FiTrendingUp } = FiIcons;

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-[#ffffff] overflow-hidden">
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col lg:flex-row items-center min-h-screen">
        {/* Content */}
        <motion.div 
          className="lg:w-1/2 mb-12 lg:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-[#131319]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Future <span className="text-[#131319]">Starts Here</span>
          </motion.h1>

          <motion.p 
            className="text-xl lg:text-2xl mb-8 text-[#131319] leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Navigate Life's Biggest Challenges with Confidence
          </motion.p>

          <motion.p 
            className="text-lg mb-10 text-gray-600 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Feeling stuck in your career, unsure how to launch your dream business, or anxious about your financial future? FuturePath Guides provides clear, actionable blueprints to empower your journey to success.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Link to="/complete-collection" className="bg-[#131319] text-[#ffffff] hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group">
              Start Your Journey
              <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/contact" className="border-2 border-[#131319] text-[#131319] hover:bg-[#131319] hover:text-[#ffffff] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
              Learn More
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div 
          className="lg:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative">
            <div className="w-96 h-96 bg-gray-100 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <SafeIcon icon={FiTarget} className="text-8xl text-[#131319] mb-4 mx-auto" />
                <SafeIcon icon={FiTrendingUp} className="text-6xl text-[#131319]/70 mx-auto" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;