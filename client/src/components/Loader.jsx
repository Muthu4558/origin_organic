// Loader.jsx
import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = 120 }) => {
  const dots = [0, 1, 2, 3];

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-[9999] pointer-events-none">
      {/* Animated Dots */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {dots.map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-gradient-to-br from-[#7ad78b] to-[#2f8f4e]"
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Brand / Loading Text */}
      <motion.div
        className="text-gray-800 font-bold text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        Loading Origin Organic...
      </motion.div>

      {/* Optional small pulse circle */}
      <motion.div
        className="absolute rounded-full border-4 border-green-400 opacity-30"
        style={{
          width: size,
          height: size,
        }}
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Loader;
