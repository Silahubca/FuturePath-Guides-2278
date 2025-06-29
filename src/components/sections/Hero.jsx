import React from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiArrowRight, FiTrendingUp, FiTarget} = FiIcons;

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-72 sm:h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-32 h-32 sm:w-72 sm:h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 sm:w-72 sm:h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col lg:flex-row items-center min-h-screen">
        {/* Content */}
        <motion.div
          className="lg:w-1/2 text-white mb-8 lg:mb-0 text-center lg:text-left"
          initial={{opacity: 0, x: -50}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8}}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.2}}
          >
            Your Future{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Starts Here
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 text-gray-200 leading-relaxed"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.4}}
          >
            Navigate Life's Biggest Challenges with Confidence
          </motion.p>

          <motion.p
            className="text-base sm:text-lg mb-8 sm:mb-10 text-gray-300 max-w-2xl mx-auto lg:mx-0"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.6}}
          >
            Feeling stuck in your career, unsure how to launch your dream business, or anxious about your financial future? FuturePath Guides provides clear, actionable blueprints to empower your journey to success.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
            initial={{opacity: 0, y: 30}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, delay: 0.8}}
          >
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group">
              Start Your Journey
              <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          className="lg:w-1/2 flex justify-center mt-8 lg:mt-0"
          initial={{opacity: 0, x: 50}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.8, delay: 0.4}}
        >
          <div className="relative">
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <SafeIcon icon={FiTarget} className="text-4xl sm:text-6xl lg:text-8xl text-white mb-2 sm:mb-4 mx-auto" />
                <SafeIcon icon={FiTrendingUp} className="text-3xl sm:text-4xl lg:text-6xl text-blue-300 mx-auto" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;