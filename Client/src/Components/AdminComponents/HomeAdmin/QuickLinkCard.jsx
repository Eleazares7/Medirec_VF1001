// src/Components/AdminComponents/ManageDoctorsComponents/QuickLinkCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuickLinkCard = ({ link, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -8, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            className="bg-teal-50 p-6 rounded-md shadow-md transition-colors duration-300 hover:bg-teal-100"
        >
            <Link to={link.url} className="flex flex-col items-center text-center">
                <motion.svg
                    whileHover={{ rotate: 12 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 text-teal-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={link.icon}
                    />
                </motion.svg>
                <h3 className="text-lg font-semibold text-teal-800 transition-colors duration-300 hover:text-teal-900">
                    {link.name}
                </h3>
            </Link>
        </motion.div>
    );
};

export default QuickLinkCard;