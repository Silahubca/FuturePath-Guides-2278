import React from 'react';
import {motion} from 'framer-motion';
import {useNavigate} from 'react-router-dom';
import ProductCard from '../ProductCard';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiPackage, FiGift} = FiIcons;

const ProductSeries = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      title: "AI-Powered Job Search",
      subtitle: "Conquer the AI-Driven Job Market",
      description: "Feeling anxious about AI replacing jobs? Or struggling to get your resume noticed? This blueprint transforms AI from a threat into your ultimate job search ally, helping you stand out and get hired faster.",
      benefits: [
        "Leverage AI for Resumes & Interviews: Master tools to optimize your applications and ace mock interviews, saving you hours.",
        "Develop Irreplaceable Human Skills: Cultivate critical thinking, adaptability, and innovation that AI can't replicate.",
        "Navigate ATS & Modern Hiring: Craft applications that get seen by both machines and human recruiters.",
        "Unlock Remote & Flexible Roles: Find and negotiate work arrangements that fit your ideal lifestyle."
      ],
      coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ctaText: "Get Your Job Search Blueprint",
      ctaLink: "/ai-job-search",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "The AI Entrepreneur",
      subtitle: "Launch Your Lean Digital Business with AI",
      description: "Dreaming of being your own boss but fear high startup costs? This guide shows you how to harness AI to identify profitable ideas and launch a scalable online venture with minimal capital.",
      benefits: [
        "Identify High-Growth AI Business Ideas: Discover lucrative opportunities in the creator economy and tech sectors.",
        "Rigorously Validate Your Market: Use AI for rapid research to ensure your idea solves a real problem.",
        "Build an AI-Leveraged Workflow: Automate tasks and boost efficiency to scale without a large team.",
        "Master Lean Digital Marketing: Implement cost-effective strategies to reach your audience and drive sales."
      ],
      coverImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ctaText: "Start Your Business Journey",
      ctaLink: "/ai-entrepreneur",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Financial Freedom Blueprint",
      subtitle: "Master Your Money & Build Lasting Wealth",
      description: "Worried about inflation, debt, or complex financial decisions? This blueprint provides clear, actionable strategies to take control of your money and build a secure, prosperous future.",
      benefits: [
        "Demystify the Economy: Understand inflation, interest rates, and their real impact on your finances.",
        "Master Your Money with Budgeting: Get a step-by-step guide to tracking spending and achieving financial goals.",
        "Conquer Debt, Once and For All: Discover smart strategies for tackling BNPL, student loans, and other obligations.",
        "Invest for Inflation-Proofing: Learn how to protect and grow your wealth in any economic climate."
      ],
      coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      ctaText: "Secure Your Financial Future",
      ctaLink: "/financial-freedom",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

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

        {/* Products Grid - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSeries;