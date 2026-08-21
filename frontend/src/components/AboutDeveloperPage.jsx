
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import AboutDeveloper from './AboutDeveloper';

const AboutDeveloperPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4 sm:mb-6"
      >
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#C96B1D]/20 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 group"
        >
          <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#C96B1D] group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm sm:text-base font-medium text-[#5B2C18] dark:text-white">
            Back to Settings
          </span>
        </button>
      </motion.div>

      {/* About Developer Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AboutDeveloper />
      </motion.div>
    </div>
  );
};

export default AboutDeveloperPage;