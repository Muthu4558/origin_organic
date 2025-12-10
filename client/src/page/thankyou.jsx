import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

const ThankYou = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-green-50 px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-green-500"
      >
        <FaCheckCircle className="text-7xl" />
      </motion.div>
      <motion.h2
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="text-3xl font-bold mt-4 text-center"
      >
        Order Confirmed!
      </motion.h2>
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-lg mt-2 text-gray-700 text-center"
      >
        Thank you for your purchase. Your order has been placed successfully.
      </motion.p>
    </div>
  );
};

export default ThankYou;