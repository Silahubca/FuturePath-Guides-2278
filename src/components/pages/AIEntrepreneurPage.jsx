import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Footer from '../sections/Footer';

const { FiArrowRight, FiCheck, FiStar, FiDownload, FiTarget, FiTrendingUp, FiUsers, FiFileText, FiEdit3, FiZap, FiAward, FiBrain, FiRocket, FiDollarSign, FiLightbulb } = FiIcons;

const AIEntrepreneurPage = () => {
  const benefits = [
    {
      icon: FiLightbulb,
      title: "Identify High-Growth AI-Powered Business Ideas",
      description: "Discover lucrative opportunities in the booming creator economy and low-capital tech sectors, from AI content marketing to AI personal assistant services."
    },
    {
      icon: FiTarget,
      title: "Rigorously Validate Your Market",
      description: "Learn how to use AI tools for rapid market research, identify genuine customer pain points, and craft a Unique Value Proposition that truly resonates, ensuring your business solves a real problem."
    },
    {
      icon: FiRocket,
      title: "Launch Lean & Minimize Risk",
      description: "Apply proven 'lean startup' principles to build and iterate your digital products with minimal upfront investment, accelerating your time to market and maximizing agility."
    },
    {
      icon: FiZap,
      title: "Build an AI-Leveraged Workflow",
      description: "Integrate AI writing assistants, graphic design tools, and personal assistants to automate tasks, boost efficiency, and scale your operations without a large team."
    },
    {
      icon: FiTrendingUp,
      title: "Master Lean Digital Marketing & Sales",
      description: "Establish a powerful brand identity, build your online presence, and implement cost-effective marketing strategies to reach your audience and drive consistent sales."
    }
  ];

  const bonuses = [
    {
      title: "The Lean Startup Business Plan Template",
      value: "$47",
      description: "A simplified, fill-in-the-blanks template designed specifically for digital products and lean ventures. This template will guide you through defining your product, market, operations, and financial projections without the overwhelm of traditional business plans. Get started fast and stay focused on what truly matters."
    },
    {
      title: "Unique Value Proposition (UVP) Canvas & Worksheet",
      value: "$29",
      description: "Stop guessing what your customers want! This interactive worksheet will walk you through the process of identifying your target audience's deepest needs and crafting a compelling UVP that makes your offering irresistible. Ensure your message cuts through the noise and converts."
    },
    {
      title: "AI Entrepreneur's Essential Toolkit: 50+ Free & Low-Cost AI Tools",
      value: "$39",
      description: "Don't waste time searching! This curated list provides direct links and brief descriptions of the top AI tools for content creation, marketing, design, automation, and more – all selected for their affordability and ease of use for solo entrepreneurs."
    },
    {
      title: "5-Day Lean Marketing Launch Plan & Content Calendar",
      value: "$59",
      description: "Your step-by-step guide to generating buzz and driving sales for your digital product. Includes a plug-and-play content calendar with prompts for social media and email, ensuring you hit the ground running with your marketing efforts."
    }
  ];

  const testimonials = [
    {
      text: "I've always wanted to start my own business but felt overwhelmed. This blueprint made it feel achievable. The AI tools section alone is worth gold!",
      author: "Alex P.",
      role: "Aspiring Digital Creator",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "The UVP worksheet helped me clarify my idea in ways I couldn't before. It's truly a lean approach to starting up.",
      author: "Maria S.",
      role: "Freelance Consultant",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "Finally, a guide that shows you how to use AI to build a business, not just talk about it. The practical steps are exactly what I needed.",
      author: "Ben T.",
      role: "Online Course Creator",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Launch Your Profitable <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">AI-Accelerated Business</span> (Even with Minimal Capital!)
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
              Stop dreaming, start building. This blueprint reveals how to leverage Artificial Intelligence to identify high-growth ideas, validate your market, and launch a lean digital venture that thrives.
            </p>
            
            {/* Hero Visual */}
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <SafeIcon icon={FiBrain} className="text-6xl text-white mb-4 mx-auto" />
                    <div className="flex space-x-4 justify-center">
                      <SafeIcon icon={FiRocket} className="text-4xl text-purple-300" />
                      <SafeIcon icon={FiLightbulb} className="text-4xl text-pink-300" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <a 
                href="https://buy.stripe.com/eVq8wP1Mw2oa1blcII4wM05" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-5 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
              >
                GET YOUR BLUEPRINT NOW - ONLY $9.99!
                <SafeIcon icon={FiDownload} className="ml-3 group-hover:translate-y-1 transition-transform" />
              </a>
            </motion.div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <SafeIcon key={i} icon={FiStar} className="text-yellow-400 fill-current text-2xl" />
                ))}
                <span className="text-white text-lg ml-2">Rated 5/5 by entrepreneurs</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              Are You Ready to Be Your Own Boss, But <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Don't Know Where to Start?</span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The entrepreneurial spirit is strong, but the path can feel daunting. Are you overwhelmed by countless business ideas, unsure which one will actually succeed? Do you fear the high startup costs that traditionally come with launching a venture? Or perhaps you're uncertain about how to find a genuine market need that your business can truly serve?
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Many aspiring entrepreneurs get stuck here, paralyzed by the perceived complexity and risk. You have the drive, but you need a clear, actionable roadmap to turn your vision into a profitable reality.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
              The Revolution is Here: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">AI is Your Ultimate Business Partner</span>
            </h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The digital landscape has changed. Artificial Intelligence is no longer just for tech giants; it's a powerful force democratizing entrepreneurship, making it easier and more affordable than ever to launch a successful business. "The AI Entrepreneur: Blueprint for a Lean Digital Business" is your definitive guide to harnessing this revolution.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                This isn't just theory. This is a practical, step-by-step framework designed to help you:
              </p>
            </div>
          </motion.div>

          {/* Benefits Grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <SafeIcon icon={benefit.icon} className="text-4xl text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
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
              Your Time is Now. Your Business Awaits.
            </h2>
            <a 
              href="https://buy.stripe.com/eVq8wP1Mw2oa1blcII4wM05" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-5 rounded-lg font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group"
            >
              GET YOUR BLUEPRINT NOW - ONLY $9.99!
              <SafeIcon icon={FiDownload} className="ml-3 group-hover:translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Bonuses Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Exclusive Bonus Offers for <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Early Action Takers!</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              To ensure your immediate success, when you purchase "The AI Entrepreneur: Blueprint for a Lean Digital Business" today, you'll instantly receive these high-value, actionable resources:
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {bonuses.map((bonus, index) => (
              <motion.div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{bonus.title}</h3>
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-3 py-1 rounded-full font-bold">
                    Value: {bonus.value}
                  </span>
                </div>
                <p className="text-gray-300 leading-relaxed">{bonus.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-300 mb-8">
              (These bonuses are delivered instantly with your ebook purchase, giving you everything you need to start building today!)
            </p>
          </motion.div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About the Author</h2>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                An award-winning writer with years of experience honing their craft at a top publishing agency, contributing to diverse outlets from news agencies to technology blogs. With a deep understanding of market trends and a passion for empowering individuals, they have meticulously researched the intersection of AI and entrepreneurship to bring you this actionable blueprint. This ebook distills complex concepts into clear, practical strategies, ensuring you have the tools to confidently launch and grow your digital business.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
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
              What Aspiring Entrepreneurs Are Saying
            </h2>
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
                  <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full object-cover" />
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
      <section className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Don't Let Fear or Uncertainty Hold You Back. <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">The Future of Business is Here.</span>
            </h2>
            <a 
              href="https://buy.stripe.com/eVq8wP1Mw2oa1blcII4wM05" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 rounded-lg font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group mb-8"
            >
              DOWNLOAD YOUR BLUEPRINT + ALL 4 FREE BONUSES!
              <SafeIcon icon={FiDownload} className="ml-3 group-hover:translate-y-1 transition-transform" />
            </a>
            <div className="text-gray-300 space-x-6">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span>|</span>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <span>|</span>
              <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AIEntrepreneurPage;