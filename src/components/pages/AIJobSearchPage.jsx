import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import Footer from '../sections/Footer';

const { FiArrowRight, FiCheck, FiStar, FiDownload, FiTarget, FiTrendingUp, FiUsers, FiFileText, FiEdit3, FiZap, FiAward } = FiIcons;

const AIJobSearchPage = () => {
  const benefits = [
    {
      icon: FiZap,
      title: "Unleash AI as Your Job Search Superpower",
      description: "Learn step-by-step how to use AI tools for resume optimization, personalized cover letters, targeted job matching, and even mock interview preparation, saving you hours and boosting your chances."
    },
    {
      icon: FiUsers,
      title: "Master In-Demand Human Skills",
      description: "Discover the critical thinking, adaptability, and innovative thinking skills that AI can't replicate, and how to showcase them to employers, making you irreplaceable."
    },
    {
      icon: FiTarget,
      title: "Navigate the Modern Hiring Landscape",
      description: "Understand how Applicant Tracking Systems (ATS) and AI influence screening, and craft applications that get noticed by both machines and humans."
    },
    {
      icon: FiTrendingUp,
      title: "Unlock Remote & Flexible Opportunities",
      description: "Find and negotiate the work arrangements that fit your life, and learn productivity tips for thriving in a flexible environment."
    },
    {
      icon: FiAward,
      title: "Ace Every Interview",
      description: "Prepare for virtual, AI-driven, and in-person interviews with confidence, making a lasting impression that gets you hired."
    },
    {
      icon: FiFileText,
      title: "Build a Future-Proof Career",
      description: "Gain the strategic insights to continuously adapt, upskill, and stay ahead in an ever-evolving job market, ensuring long-term success."
    }
  ];

  const bonuses = [
    {
      title: "ATS-Optimized Resume Template",
      value: "$49",
      description: "A professionally designed, ATS-friendly template that ensures your resume passes initial screenings and highlights your skills effectively. Stop getting filtered out before you even get a chance!"
    },
    {
      title: "Winning Cover Letter Template",
      value: "$37",
      description: "A customizable template to craft compelling, personalized cover letters that grab attention and showcase your unique fit for any role. Make a powerful first impression every time."
    },
    {
      title: "AI Job Search Prompt Library",
      value: "$59",
      description: "Your secret weapon for leveraging AI. This curated collection of over 50 proven prompts will help you generate powerful resume bullet points, tailor cover letters instantly, practice interview questions, optimize your LinkedIn profile, and more – all with the click of a button."
    },
    {
      title: "Interview Mastery Checklist",
      value: "$29",
      description: "Walk into any interview feeling prepared and confident. This comprehensive checklist covers everything from virtual interview setup and common questions to AI interview prep and crucial follow-up strategies. Never miss a beat!"
    }
  ];

  const testimonials = [
    {
      text: "I was so overwhelmed by the job search, especially with all the talk about AI. This ebook broke it down perfectly and gave me actionable steps. I feel so much more confident now!",
      author: "Sarah L.",
      role: "Marketing Professional",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "The ATS resume tips alone were worth the price! My applications are finally getting seen, and I'm getting more interviews than ever before.",
      author: "David K.",
      role: "Software Engineer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      text: "As someone from Gen X, I was really worried about AI. This book showed me how to use it to my advantage. It's a game-changer!",
      author: "Emily R.",
      role: "Project Manager",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Land Your Dream Job Faster: Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">AI-Driven Hiring Landscape</span> of 2025
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 mb-12 leading-relaxed max-w-4xl mx-auto">
              The job market is evolving. Are you? Discover how to leverage Artificial Intelligence to your advantage, stand out from the crowd, and secure the career you deserve.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <a 
                href="https://buy.stripe.com/14A4gzaj20g2f2bbEE4wM04" 
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
                <span className="text-white text-lg ml-2">Rated 5/5 by job seekers</span>
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
              Are You Feeling <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-pink-600">Lost in the New Job Market?</span>
            </h2>
            <div className="bg-white rounded-2xl shadow-xl p-8 text-left">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                The paradox is real: millions of jobs are open, yet job seeker confidence is dipping. You might be worried about AI replacing jobs, or simply overwhelmed by the sheer volume of applications and the ever-changing hiring rules.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Generic resumes get lost in Applicant Tracking Systems (ATS), and traditional job search methods often fall short. You need a clear path, a strategic edge, and the confidence to navigate this new frontier.
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
              Your Solution: The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI-Powered Job Search Blueprint</span>
            </h2>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                This isn't just another guide. "AI-Powered Job Search: Your Blueprint for Success in 2025" is your comprehensive, actionable roadmap to transforming uncertainty into opportunity. We'll show you how to turn AI from a perceived threat into your most powerful ally, equipping you with the skills and strategies to thrive in today's competitive landscape.
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
                <SafeIcon icon={benefit.icon} className="text-4xl text-blue-600 mb-4" />
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
              Ready to Transform Your Job Search?
            </h2>
            <a 
              href="https://buy.stripe.com/14A4gzaj20g2f2bbEE4wM04" 
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
              To ensure your immediate success and give you an undeniable edge, when you purchase "AI-Powered Job Search: Your Blueprint for Success in 2025" today, you'll instantly receive these high-value, actionable resources:
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
              (These bonuses are delivered instantly with your ebook purchase, giving you everything you need to start landing interviews today!)
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
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                An award-winning writer with years of experience honing their craft at a top publishing agency, contributing to diverse outlets from news agencies to technology blogs. Driven by a passion for empowering individuals, they have meticulously researched the intersection of AI and career development to bring you this actionable blueprint. This ebook distills complex market trends into clear, practical strategies, ensuring you have the tools to confidently navigate your professional journey.
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
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
              Don't Get Left Behind. <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Secure Your Future Today!</span>
            </h2>
            <a 
              href="https://buy.stripe.com/14A4gzaj20g2f2bbEE4wM04" 
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

export default AIJobSearchPage;