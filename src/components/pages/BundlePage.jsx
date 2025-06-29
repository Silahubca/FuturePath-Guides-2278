import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiCheck, FiStar, FiDownload, FiTarget, FiTrendingUp, FiUsers, FiFileText, FiEdit3, FiZap, FiAward, FiBrain, FiRocket, FiDollarSign, FiLightbulb, FiShield, FiPieChart, FiHome, FiCreditCard, FiGift, FiPackage } = FiIcons;

const BundlePage = () => {
  const bundleProducts = [
    {
      title: "AI-Powered Job Search",
      subtitle: "Master the AI-Driven Job Market",
      icon: FiTarget,
      gradient: "from-blue-500 to-cyan-500",
      originalPrice: "$9.99",
      keyBenefits: [
        "AI-optimized resume & cover letter templates",
        "ATS navigation strategies",
        "50+ AI job search prompts",
        "Interview mastery checklist"
      ]
    },
    {
      title: "The AI Entrepreneur",
      subtitle: "Launch Your Lean Digital Business",
      icon: FiRocket,
      gradient: "from-purple-500 to-pink-500",
      originalPrice: "$9.99",
      keyBenefits: [
        "Lean startup business plan template",
        "UVP canvas & worksheet",
        "50+ AI tools toolkit",
        "5-day marketing launch plan"
      ]
    },
    {
      title: "Financial Freedom Blueprint",
      subtitle: "Master Money & Build Wealth",
      icon: FiTrendingUp,
      gradient: "from-green-500 to-emerald-500",
      originalPrice: "$9.99",
      keyBenefits: [
        "Money Map budgeting tracker",
        "Debt demolisher worksheet",
        "Inflation-proof portfolio guide",
        "Financial goal setter"
      ]
    }
  ];

  const bundleBenefits = [
    {
      icon: FiZap,
      title: "Complete Life Transformation",
      description: "Master your career, launch your business, and secure your finances - all in one comprehensive package."
    },
    {
      icon: FiShield,
      title: "Future-Proof Your Success",
      description: "Whether you want job security, entrepreneurial freedom, or financial independence - you're covered for any path."
    },
    {
      icon: FiBrain,
      title: "AI-Powered Advantage",
      description: "Leverage artificial intelligence across all areas of your life with our cutting-edge strategies and tools."
    },
    {
      icon: FiGift,
      title: "12 Bonus Resources Included",
      description: "Get all premium templates, worksheets, and guides worth $174 in additional value - absolutely free."
    }
  ];

  const testimonials = [
    {
      text: "This bundle changed my entire trajectory. I got a better job, started a side business, and finally have my finances under control. Best investment I've ever made!",
      author: "Michael R.",
      role: "Complete Success Story",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "Having all three blueprints gave me options and confidence. I'm now freelancing while building my business and saving more than ever before.",
      author: "Sarah K.",
      role: "Multi-Path Success",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "The comprehensive approach is brilliant. Instead of struggling in one area, I'm now winning in all three. This bundle is a life-changer!",
      author: "David L.",
      role: "Holistic Transformation",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  const originalTotal = 29.97;
  const bundlePrice = 26.97;
  const savings = originalTotal - bundlePrice;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div 
            className="text-center max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center bg-yellow-400 text-gray-900 px-6 py-2 rounded-full font-bold text-sm mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <SafeIcon icon={FiGift} className="mr-2" />
              LIMITED TIME BUNDLE OFFER - SAVE $3.00!
            </motion.div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              The Complete 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400"> Life Mastery</span> Collection
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-200 mb-8 leading-relaxed max-w-4xl mx-auto">
              Transform Every Area of Your Life: Career Success + Business Freedom + Financial Security
            </p>

            <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
              Why choose just one path when you can master them all? Get our complete trilogy of success blueprints and unlock unlimited possibilities for your future.
            </p>

            {/* Pricing Display */}
            <motion.div 
              className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl text-gray-300 line-through">${originalTotal}</span>
                  <span className="text-5xl font-bold text-white">${bundlePrice}</span>
                </div>
                <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block font-bold">
                  Save ${savings.toFixed(2)} (10% OFF)
                </div>
                <p className="text-gray-300 mt-3">All 3 Blueprints + 12 Bonus Resources</p>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-12 py-5 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group">
                GET THE COMPLETE COLLECTION NOW!
                <SafeIcon icon={FiDownload} className="ml-3 group-hover:translate-y-1 transition-transform" />
              </button>
            </motion.div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="text-yellow-400 fill-current text-2xl" />
                ))}
                <span className="text-white text-lg ml-2">Rated 5/5 by life transformation seekers</span>
              </div>
              <p className="text-gray-300 text-sm">Join 10,000+ people who've transformed their lives with our complete system</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What's Included in Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Complete Collection</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three comprehensive blueprints that work together to create your ultimate success strategy
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
            {bundleProducts.map((product, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`bg-gradient-to-br ${product.gradient} p-6 text-white`}>
                  <SafeIcon icon={product.icon} className="text-4xl mb-4" />
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-sm opacity-90">{product.subtitle}</p>
                  <div className="mt-4 text-right">
                    <span className="text-lg font-bold">Value: {product.originalPrice}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Resources Included:</h4>
                  <div className="space-y-2">
                    {product.keyBenefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheck} className="text-green-500 text-sm mt-1 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bundle Benefits */}
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose the Complete Collection?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {bundleBenefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SafeIcon icon={benefit.icon} className="text-3xl text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                    <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Stop Playing it Safe with 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600"> Half-Measures</span>
            </h2>
            
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Here's the truth: Most people fail because they try to fix just one area of their life at a time. They focus only on their career while their finances crumble. Or they start a business but lack the job security to take risks. Or they save money but never invest in their growth.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                <strong>Success isn't about choosing one path—it's about mastering all the paths that lead to freedom.</strong>
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The Complete Life Mastery Collection gives you the comprehensive toolkit to win in every area. No more choosing between security and opportunity. No more sacrificing one dream for another. It's time to have it all.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Ready to Master Every Area of Your Life?
            </h2>
            <button className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-5 rounded-lg font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group">
              GET THE COMPLETE COLLECTION - SAVE $3.00!
              <SafeIcon icon={FiDownload} className="ml-3 group-hover:translate-y-1 transition-transform" />
            </button>
            <p className="text-white/80 mt-4">3 Blueprints + 12 Bonus Resources • Instant Download</p>
          </motion.div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Complete Life Transformation Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what happens when you stop playing small and go all-in on your success
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center space-x-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Your Complete Life Transformation Starts Now
            </h2>
            
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
              Don't spend years trying to figure it out alone. Get the complete roadmap to career success, business freedom, and financial security—all for less than the cost of a nice dinner out.
            </p>

            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-12 max-w-md mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <span className="text-2xl text-gray-300 line-through">${originalTotal}</span>
                  <span className="text-4xl font-bold text-white">${bundlePrice}</span>
                </div>
                <div className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full inline-block font-bold mb-4">
                  LIMITED TIME: Save ${savings.toFixed(2)}
                </div>
              </div>
            </div>
            
            <button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-12 py-6 rounded-lg font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group mb-8">
              GET THE COMPLETE COLLECTION NOW!
              <SafeIcon icon={FiPackage} className="ml-3 group-hover:translate-y-1 transition-transform" />
            </button>

            <div className="text-gray-300 space-x-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>|</span>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default BundlePage;