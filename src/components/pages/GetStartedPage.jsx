import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.jsx';
import GetStartedComponent from '../onboarding/GetStartedComponent';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlay, FiTarget, FiBook, FiTrendingUp } = FiIcons;

const GetStartedPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <SafeIcon icon={FiPlay} className="text-6xl text-gray-400 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Get Started Guide</h1>
          <p className="text-gray-600 mb-6">
            Please sign in to access your personalized get started guide and begin your success journey.
          </p>
          <button
            onClick={() => window.location.href = '/#/'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-16">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SafeIcon icon={FiPlay} className="text-6xl text-white mx-auto mb-8" />
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Your Success Journey Starts Here
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Follow our step-by-step guide to maximize your experience with FuturePath Guides and accelerate your path to success.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SafeIcon icon={FiTarget} className="text-4xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Path</h3>
              <p className="text-gray-600">
                Get a customized roadmap based on your goals and current progress
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <SafeIcon icon={FiBook} className="text-4xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step-by-Step</h3>
              <p className="text-gray-600">
                Clear, actionable steps to help you make the most of your blueprints
              </p>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <SafeIcon icon={FiTrendingUp} className="text-4xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your advancement and celebrate milestones along the way
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* GetStarted Component */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <GetStartedComponent />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Ready to Continue Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Once you've completed the get started guide, explore your dashboard to access your purchased content and track your progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/#/dashboard'}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.location.href = '/#/library'}
                className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300"
              >
                Browse Library
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;