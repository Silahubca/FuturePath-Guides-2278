import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiCheck } = FiIcons;

const ProductCard = ({ product, index }) => {
  // URLs for the Stripe payment links
  const paymentLinks = {
    "/ai-job-search": "https://buy.stripe.com/14A4gzaj20g2f2bbEE4wM04",
    "/ai-entrepreneur": "https://buy.stripe.com/eVq8wP1Mw2oa1blcII4wM05",
    "/financial-freedom": "https://buy.stripe.com/5kQfZh0Is3se1bleQQ4wM06",
    "/complete-collection": "https://buy.stripe.com/fZu3cv8aUe6S8DN2444wM03"
  };

  return (
    <motion.div 
      className="bg-[#ffffff] rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-200"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
    >
      {/* Cover Image */}
      <div className="relative h-64 overflow-hidden">
        <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-80`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-white text-center px-4">
            {product.title}
          </h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h4 className="text-xl font-semibold text-[#131319] mb-3">
          {product.subtitle}
        </h4>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {product.description}
        </p>
        
        {/* Benefits */}
        <div className="space-y-3 mb-8">
          {product.benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <SafeIcon icon={FiCheck} className="text-green-500 text-lg mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <a 
          href={paymentLinks[product.ctaLink]} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`w-full bg-[#131319] text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center group`}
        >
          {product.ctaText}
          <SafeIcon icon={FiArrowRight} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
};

export default ProductCard;