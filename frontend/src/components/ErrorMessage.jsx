// src/components/ErrorMessage.jsx

import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { motion } from 'framer-motion';

function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <motion.div
      className="error-message-container"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FiAlertTriangle className="error-icon" />
      <p className="error-text">{message}</p>
    </motion.div>
  );
}

export default ErrorMessage;