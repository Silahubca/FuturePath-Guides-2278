import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import PricingCards from '../pricing/PricingCards';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiPackage, FiGift} = FiIcons;

const ProductSeries = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{opacity: 0, y: 50}}
          whileInView={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          viewport={{once: true}}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our Digital Empowerment Series
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Your Blueprint for Success - We've crafted a powerful series of ebooks, each a comprehensive guide to mastering a critical area of your life. Choose your path to empowerment:
          </p>

          {/* Bundle Offer Callout */}
          <motion.div
            className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto mb-8 sm:mb-12"
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            transition={{duration: 0.6, delay: 0.2}}
            viewport={{once: true}}
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3">
              <SafeIcon icon={FiGift} className="text-xl sm:text-2xl text-purple-600" />
              <h3 className="text-lg sm:text-xl font-bold text-purple-900">Special Bundle Offer!</h3>
            </div>
            <p className="text-sm sm:text-base text-purple-800 mb-4">
              Get all 3 blueprints together and save 10% • Only <span className="font-bold">$26.97</span> instead of $29.97
            </p>
            <button
              onClick={() => navigate('/complete-collection')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto group text-sm sm:text-base"
            >
              <SafeIcon icon={FiPackage} className="mr-2" />
              Get the Complete Collection
            </button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <PricingCards />
      </div>
    </section>
  );
};

export default ProductSeries;