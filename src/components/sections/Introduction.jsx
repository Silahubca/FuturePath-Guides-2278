import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck, FiUsers, FiTrendingUp } = FiIcons;

const Introduction = () => {
  const features = [
    "Expert-backed blueprints designed to cut through the noise",
    "Practical tools and confidence you need to thrive",
    "Simple, actionable strategies for complex challenges",
    "Clear roadmap to your best life"
  ];

  return (
    <section className="py-20 bg-[#ffffff]">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-[#131319] mb-8">
            Are You Ready to <span className="text-[#131319]">Transform Your Path?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            In today's fast-paced world, it's easy to feel overwhelmed. You might be navigating a complex job market, dreaming of entrepreneurship but unsure where to begin, or grappling with economic uncertainties that make saving for tomorrow feel impossible.
          </p>

          <div className="bg-[#ffffff] rounded-2xl shadow-xl p-8 mb-12 border border-gray-200">
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              At FuturePath Guides, we believe everyone deserves a clear roadmap to their best life. We've distilled complex challenges into simple, actionable strategies, empowering you to take control, build wealth, and achieve your aspirations.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SafeIcon icon={FiCheck} className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <SafeIcon icon={FiUsers} className="text-4xl text-[#131319] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#131319] mb-2">Expert-Backed</h3>
              <p className="text-gray-600">Strategies developed by industry professionals</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <SafeIcon icon={FiTrendingUp} className="text-4xl text-[#131319] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#131319] mb-2">Proven Results</h3>
              <p className="text-gray-600">Actionable blueprints that deliver real outcomes</p>
            </motion.div>

            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <SafeIcon icon={FiCheck} className="text-4xl text-[#131319] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#131319] mb-2">Clear & Simple</h3>
              <p className="text-gray-600">Complex challenges made easy to understand</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Introduction;