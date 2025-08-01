import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Footer from '../sections/Footer';
import { Link } from 'react-router-dom';

const { FiArrowRight, FiCheck, FiStar, FiDownload, FiTarget, FiTrendingUp, FiUsers, FiFileText, FiEdit3, FiZap, FiAward, FiBrain, FiRocket, FiDollarSign, FiLightbulb, FiShield, FiPieChart, FiHome, FiCreditCard } = FiIcons;

const FinancialFreedomPage = () => {
  const benefits = [
    {
      icon: FiTrendingUp,
      title: "Demystify the Economy",
      description: "Understand the real impact of inflation, tariffs, and interest rates on your money, so you can make informed decisions, not fearful ones."
    },
    {
      icon: FiPieChart,
      title: "Master Your Money with Budgeting",
      description: "Get a step-by-step guide to creating a personal budget that works for you, helping you track spending, identify savings opportunities, and achieve your financial goals."
    },
    {
      icon: FiShield,
      title: "Build Unshakeable Savings",
      description: "Learn strategic methods for building robust emergency funds and leveraging high-yield accounts to grow your money safely and efficiently."
    },
    {
      icon: FiCreditCard,
      title: "Conquer Debt, Once and For All",
      description: "Discover smart strategies for tackling BNPL loans, student debt, and other obligations, including comparing powerful repayment methods like Debt Snowball vs. Debt Avalanche."
    },
    {
      icon: FiTarget,
      title: "Invest for Inflation-Proofing",
      description: "Get a beginner's guide to investing in assets that protect and grow your wealth during inflationary periods, including TIPS, commodities, and real estate."
    },
    {
      icon: FiHome,
      title: "Navigate the Housing Market",
      description: "Learn practical tips for buying a home when interest rates are high, including understanding ARMs, mortgage points, and buydowns."
    }
  ];

  const bonuses = [
    {
      title: "The \"Money Map\" Budgeting & Spending Tracker",
      subtitle: "(Interactive Spreadsheet)",
      value: "$49",
      description: "A powerful, easy-to-use Google Sheets/Excel compatible template. This tracker helps you implement the budgeting strategies from the ebook, categorize every dollar, visualize your cash flow, and track your progress towards financial goals with precision. Stop guessing where your money goes and start directing it!"
    },
    {
      title: "Debt Demolisher: Snowball vs. Avalanche Worksheet",
      subtitle: "(Printable PDF)",
      value: "$37",
      description: "Feeling overwhelmed by debt? This practical worksheet guides you through listing your debts, choosing the most effective payoff strategy (Debt Snowball for motivation or Debt Avalanche for maximum savings), and tracking your journey to becoming debt-free. Your personalized path to freedom starts here."
    },
    {
      title: "Inflation-Proof Portfolio Quick-Start Guide",
      subtitle: "(Actionable Checklist)",
      value: "$29",
      description: "Don't let inflation erode your wealth! This concise checklist breaks down complex investment strategies into simple, actionable steps. Learn which assets thrive during inflation and how to adjust your portfolio, even as a beginner, to protect and grow your money."
    },
    {
      title: "Your Personalized Financial Goal Setter",
      subtitle: "(Printable Worksheet)",
      value: "$25",
      description: "Clarity is power when it comes to your money. This worksheet helps you define your short-term and long-term financial goals, break them into achievable milestones, and create a clear roadmap to reach them. From saving for a down payment to planning for retirement, turn your dreams into a concrete plan."
    }
  ];

  const testimonials = [
    {
      text: "I finally understand inflation and how to invest during these times. This book is a game-changer for anyone feeling lost with their money!",
      author: "Jessica M.",
      role: "Small Business Owner",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "The debt worksheets are incredibly helpful. I've tried budgeting before, but this blueprint gave me the practical steps I needed to stick with it.",
      author: "Mark T.",
      role: "Recent Graduate",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "Navigating mortgage rates felt impossible until I read this. The clear explanations and actionable tips made me feel so much more confident about my home-buying plans.",
      author: "Sarah P.",
      role: "First-Time Homebuyer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Financial Freedom:</span> Master Inflation, Conquer Debt & Build Lasting Wealth
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
              The economy is uncertain, but your financial future doesn't have to be. This blueprint provides clear, actionable strategies to take control of your money, starting today.
            </p>
            
            {/* Hero Visual */}
            <motion.div 
              className="flex justify-center mb-12"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <SafeIcon icon={FiTrendingUp} className="text-6xl text-white mb-4 mx-auto" />
                    <div className="flex space-x-4 justify-center">
                      <SafeIcon icon={FiDollarSign} className="text-4xl text-green-300" />
                      <SafeIcon icon={FiShield} className="text-4xl text-emerald-300" />
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
                href="https://buy.stripe.com/5kQfZh0Is3se1bleQQ4wM06" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-5 rounded-lg font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center group"
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
                <span className="text-white text-lg ml-2">Rated 5/5 by financial achievers</span>
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
              Are Economic Uncertainties <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Keeping You Up At Night?</span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                You're not alone if you feel the widespread desire to improve your financial well-being, yet struggle with the practical steps. Perhaps you're anxious about rising inflation eroding your savings, burdened by mounting debt, or simply overwhelmed by complex financial decisions like navigating high mortgage rates or understanding new payment methods like BNPL.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                The truth is, nearly 40% of Americans would rely on credit for a $400 emergency, highlighting a significant gap between wanting financial stability and actually achieving it. You need more than just information; you need a clear, actionable path to transform uncertainty into tangible control and lasting wealth.
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
              Your Solution: <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">The Financial Freedom Blueprint</span>
            </h2>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This isn't just another finance book. "Financial Freedom Blueprint: Navigate Inflation & Build Wealth" is your comprehensive, actionable guide to mastering your money in any economic climate. We'll bridge the "financial empowerment gap," providing you with practical tools and expert-backed strategies to confidently build a secure and prosperous future.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed font-semibold">
                What You'll Gain from This Blueprint:
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
                <SafeIcon icon={benefit.icon} className="text-4xl text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                <p className="text-gray-700 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
              Ready to Take Control of Your Financial Future?
            </h2>
            <a 
              href="https://buy.stripe.com/5kQfZh0Is3se1bleQQ4wM06" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-green-600 hover:bg-gray-100 px-12 py-5 rounded-lg font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group"
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
              To ensure you have every tool you need to achieve financial mastery, when you purchase "Financial Freedom Blueprint: Navigate Inflation & Build Wealth" today, you'll instantly receive these high-value, actionable resources:
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
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{bonus.title}</h3>
                    <p className="text-green-400 text-sm font-medium">{bonus.subtitle}</p>
                  </div>
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
              (These bonuses are delivered instantly with your ebook purchase, giving you everything you need to start building your wealth today!)
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
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                An award-winning writer with years of experience honing their craft at a top publishing agency, contributing to diverse outlets from news agencies to technology blogs. With a deep understanding of market trends and a passion for empowering individuals, they have meticulously researched the complexities of personal finance to bring you this actionable blueprint. This ebook distills economic challenges into clear, practical strategies, ensuring you have the tools to confidently navigate your financial journey.
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
              What Readers Are Saying
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
      <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Don't Let Financial Uncertainty Control Your Life. <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Take Action Now!</span>
            </h2>
            <a 
              href="https://buy.stripe.com/5kQfZh0Is3se1bleQQ4wM06" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 rounded-lg font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto group mb-8"
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

export default FinancialFreedomPage;