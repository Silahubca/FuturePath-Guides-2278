import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import questConfig from '../../config/questConfig';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle } = FiIcons;

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Get user ID from localStorage or use default from config
  const userId = localStorage.getItem('userId') || questConfig.USER_ID;

  const EventTracking = () => {
    // Track feedback button click
    if (window.trackEvent) {
      window.trackEvent('feedback_button_clicked', {
        timestamp: new Date().toISOString(),
        page: window.location.pathname
      });
    }
  };

  const handleToggle = () => {
    EventTracking();
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        onClick={handleToggle}
        className="flex gap-1 rounded-t-md rounded-b-none justify-end items-center px-3 text-sm leading-5 font-semibold py-2 text-white z-50 fixed top-[calc(50%-20px)] -right-10 rotate-[270deg] transition-all h-9 shadow-lg hover:shadow-xl"
        style={{ background: questConfig.PRIMARY_COLOR }}
        initial={{ x: 0 }}
        whileHover={{ x: -5 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-fit h-fit rotate-90 transition-all duration-300">
          <SafeIcon icon={FiMessageCircle} className="text-lg" />
        </div>
        <p className="text-white text-sm font-medium leading-none">Feedback</p>
      </motion.button>

      {/* Feedback Workflow Component */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50"
          >
            <FeedbackWorkflow
              uniqueUserId={userId}
              questId={questConfig.QUEST_FEEDBACK_QUESTID}
              isOpen={isOpen}
              accent={questConfig.PRIMARY_COLOR}
              onClose={handleClose}
              style={{
                zIndex: 9999,
                maxWidth: '400px',
                width: '90vw'
              }}
            >
              <FeedbackWorkflow.ThankYou />
            </FeedbackWorkflow>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackButton;