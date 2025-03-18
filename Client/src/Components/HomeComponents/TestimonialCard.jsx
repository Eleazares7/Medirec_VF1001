// TestimonialCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import variants from '../../Utils/animations.js';

const [childVariants] = variants;

const TestimonialCard = ({ user, index }) => (
  <motion.div
    className="bg-white text-teal-800 p-6 rounded-2xl shadow-xl border border-teal-200"
    variants={childVariants}
    whileHover={{ scale: 1.05 }}
    transition={{ delay: index * 0.3 }}
  >
    <motion.img
      src={user.image}
      alt={user.name}
      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-teal-600"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    />
    <motion.p className="text-gray-700 text-sm italic text-center mb-3" variants={childVariants}>
      "{user.comment}"
    </motion.p>
    <motion.p className="text-teal-800 font-semibold text-center" variants={childVariants}>
      {user.name}
    </motion.p>
  </motion.div>
);

export default TestimonialCard;