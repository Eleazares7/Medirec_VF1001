// FeatureItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import variants from '../../Utils/animations.js';

const [childVariants] = variants;

const FeatureItem = ({ item, index }) => (
    <motion.div variants={childVariants} transition={{ delay: index * 0.2 + 0.6 }}>
        <motion.svg
            className="w-12 h-12 mx-auto mb-4 text-teal-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
        </motion.svg>
        <p className="text-teal-100 font-medium">{item.text}</p>
    </motion.div>
);

export default FeatureItem;